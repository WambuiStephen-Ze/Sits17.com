
import { Sequelize} from 'sequelize';
import dotenv from 'dotenv';
import userModel from './userModel.js';
import sitterModel from './sitter.js';
import bookingModel from './sitter.js';

dotenv.config();

// Sequelize initialization
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Initialize models
const User = userModel(sequelize);
const Sitter = sitterModel(sequelize);
const Booking = bookingModel(sequelize);
// relationships 
User.hasMany(Sitter, { foreignKey: 'userId', as: 'sitters' }); 
Sitter.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

// Sync the models with the database
(async () => {
  await sequelize.sync();
})();

export { sequelize, connectDB, User, Sitter };
