import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUsers, getUser, createUser } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import { connectDB} from './models/index.js';
import booking from './models/booking.js'
import { registerSitter, getAllSitters, getSitterById, updateSitter, loginSitter } from './controllers/sitterController.js';
import bookingRoutes from './routes/bookingRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bodyParser from 'body-parser';
import { loginParent } from './controllers/userController.js';

dotenv.config();

const zoomToken = process.env.ZOOM_JWT_TOKEN;

const app = express();

// For __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

const storage = multer.memoryStorage(); // Store file in memory (or use diskStorage for files)
const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, '../Frontend'))); // Serve frontend static files
app.use(express.static(path.join(__dirname, 'public'))); // Serve public static files

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


// Add sitter route with multer
app.post('/sitters', upload.single('profilePic'), async (req, res) => {
  try {
    const { email, password, location, availability } = req.body;
    const profilePic = req.file ? req.file.buffer.toString('base64') : null;

    if (!email || !password || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Assuming Sitter.create is defined in models
    const newSitter = await Sitter.create({
     
      firstname,
      lastname,
      email,
      contact,
      password,
      location,
      availability,
      sitterId,
      profilePic,
    });

    res.status(201).json({ message: 'Sitter registered successfully', sitter: newSitter });
  } catch (error) {
    console.error('Error registering sitter:', error);
    res.status(500).json({ message: 'Sitter registration failed', error: error.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve login.html when accessing /loginParent
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/loginSitter', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

//login 
app.post('/api/login', loginParent);
app.post('/api/loginSitter', loginSitter);
// Serve login.html when accessing /loginSitter
// app.get('/loginSitter', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'login.html'));
// });

// Serve register.html when accessing /register
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Define POST /register
app.post('/register', async (req, res) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));

  const {
    firstname,
    lastname,
    email,
    contact,
    username,
    password,
    confirmPassword,
    location,
    numberOfChildren,
    profilePic,
  } = req.body;

  const name = `${firstname} ${lastname}`;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const newUser = await createUser({
      name,
      email,
      contact,
      username,
      password,
      location,
      numberOfChildren,

      profilePic: profilePic || null,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});




//booking 
app.post('/bookings', async (req, res) => {
  try {
    const { userId, bookedSitters, bookingDate, confirmationEmail } = req.body;

    if (!userId || !bookedSitters || !bookingDate) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    const newBooking = await Booking.create({
      userId,
      bookedSitters,
      bookingDate,
      confirmationEmail: confirmationEmail ?? false,
    });

    return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});


// Global Error Handling
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/api/payment-details', (req, res) => {
  res.json({
    companyName: 'Mata2Me Ltd',
    paybill: '123456',
    accountNumber: 'M2M-001',
  });
});

export default app;