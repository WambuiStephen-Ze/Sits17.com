import { Booking, Sitter, User, sequelize } from '../models/index.js';
const { Op } = sequelize;

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  const { userId, sitterId, date, duration } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      where: {
        sitterId,
        status: {
          [Op.in]: ['pending', 'confirmed'],
        },
      },
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Sitter is already booked at this time.' });
    }

    const booking = await Booking.create({
      userId,
      sitterId,
      date,
      duration,
      status: 'pending',
    });

    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: User, as: 'User' },
        { model: Sitter, as: 'Sitter' },
      ],
    });

    res.status(201).json(fullBooking);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ message: 'Failed to create booking', err });
  }
};

/**
 * Get a booking by ID
 */
export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: 'User' },
        { model: Sitter, as: 'Sitter' },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ message: 'Failed to fetch booking', err });
  }
};

/**
 * Update a booking (e.g., change date, duration, status)
 */
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update(updates);

    const updatedBooking = await Booking.findByPk(id, {
      include: [
        { model: User, as: 'User' },
        { model: Sitter, as: 'Sitter' },
      ],
    });

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ message: 'Failed to update booking', err });
  }
};

/**
 * Get all bookings for a user
 */
export const getUserBookings = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: Sitter, as: 'Sitter' },
      ],
      order: [['date', 'DESC']],
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ message: 'Failed to fetch user bookings', err });
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: 'Failed to cancel booking', err });
  }
};
