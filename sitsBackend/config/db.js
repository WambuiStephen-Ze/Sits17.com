// services/userService.js

import { Sequelize } from 'sequelize';
import userModel from '../models/userModel.js'; //  Make sure the extension is .js
import sitter from '../models/sitter.js';
// import Booking from '../models/booking.js';
import dotenv from 'dotenv';
import { User } from '../models/index.js';
dotenv.config();

// Connect to the database
export const dbConfig = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

<<<<<<< HEAD
//  Initialize User model
const User = userModel(dbConfig);
const Sitter = sitter(dbConfig);

=======
>>>>>>> f605a1ef3a876ae81b3300d15074812ac527ef95

//  Optional: test connection
dbConfig.authenticate()
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.error('DB connection failed:', err));

//  Function to get all users
export async function getUsers() {
  try {
    return await User.findAll();
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}

//  Function to get a single user by ID
export async function getUser(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}

//  Function to get a user by email (used in login/register)
export async function getUserByEmail(email) {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
}

//  Function to create a user
export async function createUser(userData) {
  try {
    return await User.create(userData); // Sequelize hook will hash password
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

<<<<<<< HEAD
//function to get all sitters
export async function getSitters() {
  try {
    return await Sitter.findAll();
  } catch (error) {
    throw new Error(`Error fetching sitters: ${error.message}`);
  }
}

//  Function to get a single sitter by ID
export async function getSitter(id) {
  try {
    const sitter = await Sitter.findByPk(id);
    if (!sitter) throw new Error('Sitter not found');
    return sitter;
  } catch (error) {
    throw new Error(`Error fetching sitter: ${error.message}`);
  }
}

//  Function to get a sitter by email (used in login/register)
export async function getSitterByEmail(email) {
  try {
    return await Sitter.findOne({ where: { email } });
  } catch (error) {
    throw new Error(`Error fetching sitter by email: ${error.message}`);
  }
}

//  Function to create a user
export async function createSitter(userData) {
  try {
    return await Sitter.create(userData); // Sequelize hook will hash password
  } catch (error) {
    throw new Error(`Error creating sitter: ${error.message}`);
  }
}

=======
>>>>>>> f605a1ef3a876ae81b3300d15074812ac527ef95
