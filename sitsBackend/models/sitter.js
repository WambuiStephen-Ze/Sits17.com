import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';
import bcrypt from 'bcryptjs';

const Sitter = sequelize.define('sitter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  name: {
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

export default Sitter;
