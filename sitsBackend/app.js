//express app setup 
//import express from 'express';

//const app = express();

//app.use(express.json());

//app.get('/', (req, res) => {
//    res.send('Hello World!');
//});



//export default app;

// app.js
import express from 'express';

// Import routes
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const zoomToken = process.env.ZOOM_JWT_TOKEN;

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Base test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Register API routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sitters', sitterRoutes);
app.use('/api/email', emailRoutes);

export default app;

