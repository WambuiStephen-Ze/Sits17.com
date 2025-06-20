import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcrypt';
import bookingRoutes from './routes/bookingRoutes.js';
// Import your DB connection, models, and controllers
import { connectDB } from './models/index.js';
import { getUsers, getUser, createUser, getUserByEmail } from './config/db.js';
import Sitter from './models/sitter.js';            
import Booking from './models/booking.js';            
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { registerSitter, getAllSitters, getSitterById, updateSitter, loginSitter } from './controllers/sitterController.js';
import { registerParent ,loginParent } from './controllers/userController.js';
import { createBooking } from './controllers/bookingController.js'

dotenv.config();

const app = express();

// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup for file upload in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ----- GLOBAL ERROR HANDLER -----
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).send('Something went wrong!');
});
// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
// ----- SITTER ROUTES -----
// Use sitterRoutes if they contain routes for sitters
app.use('/api/sitters', sitterRoutes);
app.use('/api/bookings', bookingRoutes);

// ----- EMAIL ROUTES -----
app.use('/api/sendConfirmation', emailRoutes);

// ----- AUTH ROUTES -----
app.use('/api/authenticate', authRoutes);

// ----- USER ROUTES -----
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by id (Works)
app.get('/users/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all sitters
app.get('/sitters', getAllSitters);
// Get sitter by ID
app.get('/sitters/:id', getSitterById);
// ----- STATIC ROUTES -----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
// ----- REGISTER ROUTE -----
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});
// ----- PAYMENT DETAILS -----
app.get('/api/payment-details', (req, res) => {
  res.json({
    companyName: 'Mata2Me Ltd',
    paybill: '123456',
    accountNumber: 'M2M-001',
  });
});


// Booking creation route
app.post('/bookings', createBooking);

// Create user (alternative endpoint, or can remove if using /register)
app.post('/users', async (req, res) => {
  try {
    const { firstname, lastname, numKids, ageKids, phone, email, location, profilePic, password, confirmPassword } = req.body;
    if (!firstname || !lastname || !numKids || !ageKids || !phone || !email || !location || !profilePic || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      firstname,
      lastname,
      numKids,
      ageKids,
      phone,
      email,
      location,
      profilePic,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Custom POST sitter registration with multer file upload and password hashing
app.post('/sitters', upload.single('profilePic'), async (req, res) => {
  try {
    const { firstname, lastname, location, years, availability, phone, email, password, confirmPassword } = req.body;
    const profilePic = req.file ? req.file.buffer.toString('base64') : null;

    // Validate required fields
    if (!firstname || !lastname || !location || !profilePic || !years || !availability || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSitter = await Sitter.create({
      firstname,
      lastname,
      location,
      profilePic,
      years,
      availability,
      phone,
      email,
      password: hashedPassword,
    });
    res.redirect('/login.html'); 
    res.status(201).json({ message: 'Sitter registered successfully', sitter: newSitter });
  } catch (error) {
    console.error('Error registering sitter:', error);
    res.status(500).json({ message: 'Sitter registration failed', error: error.message });
  }
});

app.post('/register', registerParent);
app.post('/login', loginParent);
/* 

app.post('/register', async (req, res) => {
  console.log('register Request Body:', req.body);
  
  
  const {
    firstname,
    lastname,
    numKids,
    ageKids,
    phone,
    email,
    location,
    profilePic,
    password,
    confirmPassword,
  } = req.body;

  if (!firstname || !lastname || !numKids || !ageKids || !phone || !email || !location || !profilePic || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (password !== confirmPassword) {
    console.log('Entered password:', `"${password}"`);
    console.log('Stored hash:', user.password);
    return res.status(400).json({ message: 'Passwords do not match' });

  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      firstname,
      lastname,
      numKids,
      ageKids,
      phone,
      email,
      location,
      profilePic,
      password: hashedPassword,
    });
    res.redirect('/login.html'); 

    // res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

*/

// Update sitter
app.put('/sitters/:id', updateSitter);

// ----- BOOKING ROUTES -----
// router.get('/:id', protect, getBookingById);
// app.js

// ----- LOGIN ROUTES -----
// Separate login routes for parent and sitter

// Parent login route
// app.post('/api/login/parent', loginParent);

// Sitter login route
// app.post('/api/login/sitter', loginSitter);

// Or generic login with bcrypt check (example below)



// app.post('/login', async (req, res) => {
//    console.log('Login Request Body:', req.body);  // <== LOG HERE
//   const { email, password } = req.body;
  


//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   try {
//     const user = await getUserByEmail(email);
//     console.log("USER:", user);
//     if (!user) {

//       return res.status(401).json({ message: 'Invalid email.' });
//     }
    
//       const comparePassword = await bcrypt.compareSync(password, user.password);

//         if (!comparePassword) {
//           return res.status(400).json({
//             status: false,
//             message: "Invalid email or password",
//             data: [],
//           });
//         }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       bcrypt.compare(password, user.password).then(isMatch => {
// //      console.log('Manual compare result:', isMatch);
// // });
    
// //       console.log('Entered password:', `"${password}"`);
// //       console.log('Stored (hashed) password:', user.password);
// //       return res.status(401).json({ message: 'Invalid password.' });
// //     }

//     const { password: pw, ...userData } = user; // remove password from response
//     return res.status(200).json({ message: 'Login successful', user: userData });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login.' });
//   }
// });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required.' });
//   }

//   try {
//     const user = await getUserByEmail(email);
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }
//     // return res.redirect('/index.html');

//     // res.status(200).json({ message: 'Login successful', user });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login.' });
//   }
// });









export default app;
