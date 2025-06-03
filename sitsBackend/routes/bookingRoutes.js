import express from 'express';
import protect from '../middlewares/authMiddleware.js'; 
// import { createBooking, getBookingById, updateBooking } from '../models/index.js'; 

const router = express.Router();

// Create a new booking
router.post('/secure', protect, async (req, res) => {
  try {
    const { sitterId, userId, date } = req.body;

    // Validation of required fields
    if (!sitterId || !userId || !date) {
      return res.status(400).json({ message: 'Sitter ID, User ID, and date are required' });
    }

    // Ensuring the user making the request matches the userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'You can only create bookings for yourself' });
    }

    // Create the booking
    const newBooking = await createBooking({ sitterId, userId, date });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
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

    // Optional: Restrict access to the user who made the booking or the sitter
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

    // Restrict updates to the parent who made the booking or the sitter
    if (req.user.id !== booking.userId && req.user.id !== booking.sitterId) {
      return res.status(403).json({ message: 'Access denied to update this booking' });
    }

    // Update the booking
    const updates = req.body;
    const updatedBooking = await updateBooking(booking.id, updates);

    res.json(updatedBooking);
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

