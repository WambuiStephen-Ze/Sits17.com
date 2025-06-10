// import { sequelize, connectDB, User } from '../models/index.js';
import Sequelize  from 'sequelize';
import dotenv from 'dotenv';




dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  process.env.DB_PORT,
  // process.env.DB_SSL,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);


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

export default sequelize;
