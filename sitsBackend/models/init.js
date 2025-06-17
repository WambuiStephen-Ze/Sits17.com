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
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availability: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'sitters',
    hooks: {
      beforeCreate: async (sitter) => {
        if (sitter.password) {
          const salt = await bcrypt.genSalt(10);
          sitter.password = await bcrypt.hash(sitter.password, salt);
        }
      },
      beforeUpdate: async (sitter) => {
        if (sitter.password) {
          const salt = await bcrypt.genSalt(10);
          sitter.password = await bcrypt.hash(sitter.password, salt);
        }
      },
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
    duration: {
      type: DataTypes.INTEGER,
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
