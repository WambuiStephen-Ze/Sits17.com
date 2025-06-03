// routes/bookingRoutes.js
import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);

export default router;
