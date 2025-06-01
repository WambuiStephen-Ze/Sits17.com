//booking controls 
import { Booking } from '../models';

// Create a new booking request
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', err });
  }
};

// all bookings of an individual
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bookings', err });
  }
};

// code to cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const result = await Booking.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', err });
  }
};
