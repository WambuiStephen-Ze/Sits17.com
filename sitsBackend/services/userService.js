import User from '../models/userModel.js'
// Sequelize-based functions for user operations
export const createUser = async ({ name, username, contact, email, password, role, profilePic, location, numberOfChildren }) => {
  const { User } = await import('../models/index.js'); // Dynamic import to avoid circular dependency
  try {
    const user = await User.create({
      name,
      username,
      contact,
      email,
      password, 
      role,
      profilePic,
      location,
      numberOfChildren,
    });
    return {
      id: user.id,
      username: user.username,
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