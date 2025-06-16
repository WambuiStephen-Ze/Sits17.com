// services/userService.js

// import sequelize from '../config/db.js'; // Ensure this file exists and exports the Sequelize instance
import userModel from '../models/userModel.js';
import {
  getUserByEmail,
  getUser,
  createUser,
} from '../config/db.js'; 
// Get user by ID
export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw new Error(`Error fetching user by ID: ${error.message}`);
  }
};

// Update user
export const updateUser = async (id, updatedData) => {
  try {
    const user = await getUser(id);
    if (!user) throw new Error('User not found');
    await user.update(updatedData);
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};


export { getUserByEmail, createUser };



// // import{ Sequelize} from 'sequelize';
// import userModel from '../models/userModel.js'


// // export const dbConfig = new sequelize();

// // const User = userModel(dbConfig);

// // Sequelize-based functions for user operations
// export const createUser = async ({ name, username, contact, email, password, role, profilePic, location, numberOfChildren }) => {
//   const { User } = await import('../models/index.js'); // Dynamic import to avoid circular dependency
//   try {
//     const user = await User.create({
//       name,
//       username,
//       contact,
//       email,
//       password, 
//       role,
//       profilePic,
//       location,
//       numberOfChildren,
//     });
//     return {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       profilePic: user.profilePic,
//       location: user.location,
//       numberOfChildren: user.numberOfChildren,
//     };
//   } catch (error) {
//     throw new Error(`Error creating user: ${error.message}`);
//   }
// };

// export const getUserById = async (id) => {
//   const { User } = await import('../models/index.js');
//   try {
//     const user = await User.findByPk(id);
//     if (!user) throw new Error('User not found');
//     return user;
//   } catch (error) {
//     throw new Error(`Error fetching user: ${error.message}`);
//   }
// };

// //updated one 
// export async function getUserByEmail(email) {
//   try {
//     return await User.findOne({ where: { email } });
//   } catch (error) {
//     throw new Error(`Error fetching user by email: ${error.message}`);
//   }
// }

// export const updateUser = async (id, updates) => {
//   const { User } = await import('../models/index.js');
//   try {
//     const user = await User.findByPk(id);
//     if (!user) throw new Error('User not found');
//     await user.update(updates);
//     return user;
//   } catch (error) {
//     throw new Error(`Error updating user: ${error.message}`);
//   }
// };