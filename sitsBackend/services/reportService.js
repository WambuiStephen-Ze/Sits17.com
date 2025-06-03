// Booking history/report generator 
// services/reportService.js
import { UserProfile } from '../models/user.js';
import { BookingConfirmation } from '../models/booking.js';

export const generateBookingReport = async () => {
  try {
    const totalBookings = await BookingConfirmation.count();
    const completedBookings = await BookingConfirmation.count({ where: { status: 'completed' } });

    return {
      totalBookings,
      completedBookings
    };
  } catch (error) {
    console.error('Error generating booking report:', error);
    throw error;
  }
};
