import { DataTypes } from 'sequelize';
import { sequelize } from '../models/index.js'; // Import the instantiated sequelize instance
// import User from './userModel.js';
// import Sitter from './sitter.js';

// Use the sequelize instance to define the model (not Sequelize directly)
const Booking = sequelize.define('Booking', {
  bookedSitters: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  confirmationEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  bookingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
}, 
{
  tableName: 'bookings',
  timestamps: true,
});

// // Relationships
// Booking.belongsTo(User, { as: 'parent', foreignKey: 'userId' });  // Parent making the booking
// Booking.belongsTo(User, { as: 'sitter', foreignKey: 'sitterId' }); // Sitter being booked

// User.hasMany(Booking, { as: 'parentBookings', foreignKey: 'userId' });
// User.hasMany(Booking, { as: 'sitterBookings', foreignKey: 'sitterId' });

export default Booking;