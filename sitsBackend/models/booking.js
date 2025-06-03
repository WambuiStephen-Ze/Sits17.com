import { DataTypes } from 'sequelize';
import { sequelize } from './index.js'; // Import the instantiated sequelize instance
import User from './userModel.js';
import Sitter from './sitter.js';

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

// Relationships
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

export default Booking;