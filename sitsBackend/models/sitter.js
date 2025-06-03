// models/sitter.js
import { DataTypes } from 'sequelize';
import  sequelize  from '../config/config.js';

export const SitterProfile = sequelize.define('SitterProfile', {
  name: { type: DataTypes.STRING, allowNull: false },
  profilePic: { type: DataTypes.STRING },
  experience: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  availability: { type: DataTypes.JSON },
}, {
  tableName: 'sitter_profiles',
  timestamps: true,
});
