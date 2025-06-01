import { Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: true, // e.g., 'parent' or 'sitter'
    },
    profilePic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    numberOfChildren: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  }, {
    timestamps: false, // Disable createdAt and updatedAt
    tableName: 'users', // Explicitly set table name
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  return User;
};

// Sequelize-based functions for user operations
export const createUser = async ({ name, email, password, role, profilePic, location, numberOfChildren }) => {
  const { User } = await import('../models/index.js'); // Dynamic import to avoid circular dependency
  try {
    const user = await User.create({
      name,
      email,
      password, 
      role,
      profilePic,
      location,
      numberOfChildren,
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      location: user.location,
      numberOfChildren: user.numberOfChildren,
    };
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const getUserById = async (id) => {
  const { User } = await import('../models/index.js');
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

export const getUserByEmail = async (email) => {
  const { User } = await import('../models/index.js');
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
};

export const updateUser = async (id, updates) => {
  const { User } = await import('../models/index.js');
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(updates);
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};