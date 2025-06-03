import { sequelize, connectDB, User } from '../models/index.js';

// Functions to interact with the User table using Sequelize
export async function getUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

export async function getUser(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

export async function createUser(name, email, password, location, numberOfChildren) {
  try {
    const user = await User.create({ name, email, password, location, numberOfChildren });
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

export { sequelize, connectDB, User };