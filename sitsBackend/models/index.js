
import {dbConfig} from '../config/db.js';
import dotenv from 'dotenv';
import { initializeModels} from './init.js';

dotenv.config();

const sequelize = dbConfig;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
    await sequelize.sync();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

const { User, Sitter, Booking } = initializeModels(sequelize);

const createUser = async ({ firstname, lastname, email, password, contact, profilePic, location, numberOfChildren }) => {
  try {
    const user = await User.create({
      firstname, 
      lastname,
      email,
      password,
      contact,
      profilePic,
      location,
      numberOfChildren,
    });
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      
      email: user.email,
      contact: user.contact,
      
      profilePic: user.profilePic,
      location: user.location,
      numberOfChildren: user.numberOfChildren,
    };
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
};

const updateUser = async (id, updates) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(updates);
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Booking operation functions
const createBooking = async ({ sitterId, userId, date }) => {
  try {
    const booking = await Booking.create({
      sitterId,
      userId,
      bookingDate: new Date(date),
      status: 'pending',
    });
    return {
      id: booking.id,
      sitterId: booking.sitterId,
      userId: booking.userId,
      date: booking.date,
      status: booking.status,
    };
  } catch (error) {
    throw new Error(`Error creating booking: ${error.message}`);
  }
};

const getBookingById = async (id) => {
  try {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: 'user' },
        { model: Sitter, as: 'sitter' },
      ],
    });
    if (!booking) throw new Error('Booking not found');
    return booking;
  } catch (error) {
    throw new Error(`Error fetching booking: ${error.message}`);
  }
};

const updateBooking = async (id, updates) => {
  try {
    const booking = await Booking.findByPk(id);
    if (!booking) throw new Error('Booking not found');
    await booking.update(updates);
    return booking;
  } catch (error) {
    throw new Error(`Error updating booking: ${error.message}`);
  }
};

// Sitter operation functions
const getAllSitters = async () => {
  try {
    const sitters = await Sitter.findAll({
      include: [{ model: User, as: 'user' }],
    });
    return sitters;
  } catch (error) {
    throw new Error(`Error fetching sitters: ${error.message}`);
  }
};

const getSitterById = async (id) => {
  try {
    const sitter = await Sitter.findByPk(id, {
      include: [{ model: User, as: 'user' }],
    });
    if (!sitter) throw new Error('Sitter not found');
    return sitter;
  } catch (error) {
    throw new Error(`Error fetching sitter: ${error.message}`);
  }
};

const updateSitter = async (id, updates) => {
  try {
    const sitter = await Sitter.findByPk(id);
    if (!sitter) throw new Error('Sitter not found');
    await sitter.update(updates);
    return sitter;
  } catch (error) {
    throw new Error(`Error updating sitter: ${error.message}`);
  }
};



// Export functions and models
export { sequelize, connectDB, User, Sitter, Booking, createUser, getUserById, getUserByEmail, updateUser, createBooking, getBookingById, updateBooking, getAllSitters, getSitterById, updateSitter };