// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

export const UserProfile = sequelize.define('UserProfile', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  profilePic: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  numberOfChildren: { type: DataTypes.INTEGER },
}, {
  tableName: 'user_profiles',
  timestamps: true,
});

