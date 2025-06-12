// models/init.js
import { Sequelize, DataTypes } from 'sequelize';
import userModel from './userModel.js';
import bcrypt from 'bcryptjs';

const initializeModels = (sequelize) => {
  const User = userModel(sequelize);

  const Sitter = sequelize.define('sitter', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  const Booking = sequelize.define('booking', {
    sitterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  });

  // Define relationships
  User.hasMany(Sitter, { foreignKey: 'userId', as: 'sitters' });
  User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

  Sitter.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Sitter.hasMany(Booking, { foreignKey: 'sitterId', as: 'bookings' });

  Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Booking.belongsTo(Sitter, { foreignKey: 'sitterId', as: 'sitter' });

  return {
    User,
    Sitter,
    Booking,
  };
};

export { initializeModels };
