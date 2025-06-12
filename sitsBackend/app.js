import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUsers, getUser, createUser } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import { connectDB} from './models/index.js';
import { registerSitter, getAllSitters, getSitterById, updateSitter } from './controllers/sitterController.js';
import bookingRoutes from './routes/bookingRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bodyParser from 'body-parser';

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sitter Routes
app.post('/sitters', registerSitter);
app.get('/sitters', getAllSitters);
app.get('/sitters/:id', getSitterById);
app.put('/sitters/:id', updateSitter);

// Root Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve register.html when accessing /register
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Define POST /register
// ... (previous imports and setup remain the same)
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
    role,
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
      role,
      profilePic: profilePic || null,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});


// ... (rest of the file remains the same)

// Serve login.html when accessing /login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
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