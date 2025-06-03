import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import User from './user.js';
import Sitter from './sitter.js';

const Booking = sequelize.define('Booking', {
  bookedSitters: {
    // storing array of sitters IDs
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: [],
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
// name of the related table
      model: 'Users', 
      key: 'id',
    },
  },

  // timestamp
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

// relationships 
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

export default Booking;
