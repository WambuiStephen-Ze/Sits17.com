//app.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUsers, getUser, createUser } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
<<<<<<< HEAD
import { connectDB, User, Sitter, Booking } from './models/index.js';
=======
import { connectDB } from './models/index.js';
>>>>>>> 0cbaadcae15f56d7d23e4df7d75a52e74b14a243
import { registerSitter, getAllSitters, getSitterById,updateSitter } from './controllers/sitterController.js';
import bookingRoutes from './routes/bookingRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';
<<<<<<< HEAD
// import stripe from 'stripe';
// const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
=======
>>>>>>> 0cbaadcae15f56d7d23e4df7d75a52e74b14a243

dotenv.config();

// Import routes
<<<<<<< HEAD
// import bookingRoutes from './routes/bookingRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import sitterRoutes from './routes/sitterRoutes.js';
// import emailRoutes from './routes/emailRoutes.js';
// import dotenv from 'dotenv';
// dotenv.config();
=======
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
>>>>>>> 0cbaadcae15f56d7d23e4df7d75a52e74b14a243

const zoomToken = process.env.ZOOM_JWT_TOKEN;

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for Users (replacing Notes)
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

<<<<<<< HEAD
// STRIPE 
app.post('/payment', async (req, res) => {
  const session = await stripe.payment.sessions .create;
  line_items: [
    {
      price_deta: {
        currency: 'Nigerian Naira',
        product_data: {
          name: 'form name'
        }
      }
    }
  ]
  mode: 'payment',
  success_url, 'http://localhost:3000/pay',
  cancel_url,'http://localhost:3000/cancel'

})

=======
>>>>>>> 0cbaadcae15f56d7d23e4df7d75a52e74b14a243
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

// Root Route
app.get('/', (req, res) => {
  res.send('App is running!');
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


export default app;