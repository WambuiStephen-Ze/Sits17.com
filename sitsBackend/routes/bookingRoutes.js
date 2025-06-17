//booking routes
import express from 'express';
import protect from '../middlewares/authMiddleware.js';
console.log('Middleware loaded:', protect);
import { 
  createBooking, 
  getBookingById, 
  updateBooking, 
  getUserBookings, 
  cancelBooking } from '../controllers/bookingController.js';

import { Sitter } from '../models/index.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.get('/user/:userId', protect, getUserBookings);

// Cancel booking route
router.put('/cancel/:id', protect, cancelBooking);



// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail)
  auth: {
    user: process.env.EMAIL_USER, // Set in .env
    pass: process.env.EMAIL_PASS, // Set in .env
  },
});

// Helper function to check availability
const isAvailable = (availability, date) => {
  const day = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  if (!availability || !availability[day]) return false;
  const [startTime, endTime] = availability[day].split('-');
  const bookingTime = new Date(date).toLocaleTimeString('en-US', { hour12: false });
  const [bookingHour] = bookingTime.split(':');
  const [startHour] = startTime.split(':');
  const [endHour] = endTime.split(':');
  return bookingHour >= startHour && bookingHour < endHour;
};

// Helper function to parse experience (basic implementation)
const parseExperience = (experience) => {
  if (!experience) return 0;
  const years = parseInt(experience.match(/\d+/));
  return isNaN(years) ? 0 : years;
};

// Create a new booking with enhanced matching logic and email confirmation
router.post('/secure', protect, async (req, res) => {
  try {
    const { sitterId, userId, date } = req.body;

    // Validation of required fields
    if (!sitterId || !userId || !date) {
      return res.status(400).json({ message: 'Sitter ID, User ID, and date are required' });
    }

    // Ensure the user making the request matches the userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'You can only create bookings for yourself' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(date)) {
      return res.status(400).json({ message: 'Date must be in ISO format (e.g., 2025-06-03T10:00:00Z)' });
    }
    const bookingDate = new Date(date);
    if (bookingDate <= new Date()) {
      return res.status(400).json({ message: 'Booking date must be in the future' });
    }

    // Fetch user to get location for matching
    const user = await User.findByPk(userId);
    if (!user || !user.location) {
      return res.status(400).json({ message: 'User location not found' });
    }

    // Match sitter by location, availability, and experience
    const sitter = await Sitter.findByPk(sitterId, { include: [{ model: User, as: 'user' }] });
    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }
    if (sitter.user.location !== user.location) {
      return res.status(400).json({ message: 'Sitter location does not match user location' });
    }
    if (!isAvailable(sitter.availability, date)) {
      return res.status(400).json({ message: 'Sitter is not available at the requested time' });
    }
    const sitterExperience = parseExperience(sitter.experience);
    if (sitterExperience < 1) { // Minimum 1 year experience
      return res.status(400).json({ message: 'Sitter must have at least 1 year of experience' });
    }

    // Create the booking
    const newBooking = await createBooking({ sitterId, userId, date });

    // Send confirmation email to user and sitter
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [user.email, sitter.user.email],
      subject: 'Booking Confirmation',
      text: `Dear ${user.name} and ${sitter.user.name},\n\nA booking has been confirmed for ${date}. Details:\n- Sitter: ${sitter.user.name}\n- User: ${user.name}\n- Date: ${date}\n- Experience: ${sitter.experience}\n\nThank you for using Sits.com!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({ message: 'Failed to send confirmation email' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings for the current user
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.findAll({ where: { userId: req.user.id } });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a booking by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await getBookingById(parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (req.user.id !== booking.userId && req.user.id !== booking.sitterId) {
      return res.status(403).json({ message: 'Access denied to this booking' });
    }
    res.json(booking);
  } catch (error) {
    console.error('Booking retrieval error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a booking
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await getBookingById(parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (req.user.id !== booking.userId && req.user.id !== booking.sitterId) {
      return res.status(403).json({ message: 'Access denied to update this booking' });
    }

    const updates = req.body;
    if (updates.date) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(updates.date)) {
        return res.status(400).json({ message: 'Date must be in ISO format (e.g., 2025-06-03T10:00:00Z)' });
      }
      const bookingDate = new Date(updates.date);
      if (bookingDate <= new Date()) {
        return res.status(400).json({ message: 'Booking date must be in the future' });
      }
    }
    if (updates.status && !['pending', 'confirmed', 'cancelled'].includes(updates.status)) {
      return res.status(400).json({ message: 'Status must be one of: pending, confirmed, cancelled' });
    }
    const updatedBooking = await updateBooking(booking.id, updates);

    // Send update notification if status changes
    if (updates.status && updates.status !== booking.status) {
      const sitter = await Sitter.findByPk(booking.sitterId, { include: [{ model: User, as: 'user' }] });
      const user = await User.findByPk(booking.userId);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [user.email, sitter.user.email],
        subject: 'Booking Update',
        text: `Dear ${user.name} and ${sitter.user.name},\n\nThe booking for ${booking.date} has been updated to ${updates.status}. Details:\n- Sitter: ${sitter.user.name}\n- User: ${user.name}\n- Date: ${booking.date}\n\nThank you for using Sits.com!`,
      };
      await transporter.sendMail(mailOptions);
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await getBookingById(parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (req.user.id !== booking.userId) {
      return res.status(403).json({ message: 'Only the user can cancel this booking' });
    }
    const sitter = await Sitter.findByPk(booking.sitterId, { include: [{ model: User, as: 'user' }] });
    const user = await User.findByPk(booking.userId);
    await Booking.destroy({ where: { id: parseInt(req.params.id) } });

    // Send cancellation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [user.email, sitter.user.email],
      subject: 'Booking Cancellation',
      text: `Dear ${user.name} and ${sitter.user.name},\n\nThe booking for ${booking.date} has been cancelled. Details:\n- Sitter: ${sitter.user.name}\n- User: ${user.name}\n- Date: ${booking.date}\n\nThank you for using Sits.com!`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;