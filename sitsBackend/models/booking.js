// models/booking.js
import { DataTypes } from 'sequelize';
import sequelize  from '../config/config.js';
import {UserProfile} from './user.js';

export const BookingConfirmation = sequelize.define('BookingConfirmation', {
  bookedSitters: { type: DataTypes.JSON },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  confirmationEmail: { type: DataTypes.BOOLEAN },
  bookingDate: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'booking_confirmations',
  timestamps: true,
});

UserProfile.hasMany(BookingConfirmation, { foreignKey: 'userId' });
BookingConfirmation.belongsTo(UserProfile, { foreignKey: 'userId' });
