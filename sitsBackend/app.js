//app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUsers, getUser, createUser } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import { connectDB, User, Sitter, Booking } from './models/index.js';
import { registerSitter, getAllSitters, getSitterById,updateSitter } from './controllers/sitterController.js';
import bookingRoutes from './routes/bookingRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const zoomToken = process.env.ZOOM_JWT_TOKEN;

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Frontend')));




// Routes for Users 
app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email, password, location, numberOfChildren } = req.body;
    const newUser = await createUser(name, email, password, location, numberOfChildren);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Other Routes
app.use('/api/users', userRoutes);
app.use('/api/sitters', sitterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sendConfirmation', emailRoutes);
app.use('/api/authenticate', authRoutes);


// Sitter Routes
app.post('/sitters', registerSitter);
app.get('/sitters', getAllSitters);
app.get('/sitters/:id', getSitterById);
app.put('/sitters/:id', updateSitter);

// // Root Route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
// });

//verifying the CORS configuration 
// app.use(cors({
//   origin: 'http://localhost:5500/index.html', //frontend html 
//   credentials: true
// }));
// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/api/payment-details', (req, res) => {
  res.json({
    companyName: "Mata2Me Ltd",
    paybill: "123456",
    accountNumber: "M2M-001"
  });
});


export default app;