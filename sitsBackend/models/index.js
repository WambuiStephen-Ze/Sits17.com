import sequelize  from '../config/db.js';
import dotenv from 'dotenv';



dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     logging: false,
//   }
// );

import User from './userModel.js';
import Sitter from './sitter.js';
import Booking from './booking.js';


// Define relationships
User.hasMany(Sitter, { foreignKey: 'userId', as: 'sitters' });
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

Sitter.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Sitter.hasMany(Booking, { foreignKey: 'sitterId', as: 'bookings' });

Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Sitter, { foreignKey: 'sitterId', as: 'sitter' });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

(async () => {
  await sequelize.sync();
})();

// User operation functions
const createUser = async ({ name, email, password, role, profilePic, location, numberOfChildren }) => {
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
      date,
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

export { 
  sequelize,
  connectDB,
  User,
  Sitter,
  Booking,
  createUser, 
  getUserById, 
  getUserByEmail, 
  updateUser, 
  createBooking, 
  getBookingById, 
  updateBooking, 
  getAllSitters, 
  getSitterById, 
  updateSitter };