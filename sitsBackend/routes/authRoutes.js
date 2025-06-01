import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from'jsonwebtoken';
import dotenv from 'dotenv';
import {loginUser} from '../controllers/authController.js';


dotenv.config();

// Simulated user database (replace with actual DB like MongoDB)
let users = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);

  res.status(201).json({ message: 'User registered successfully', userId: user.id });
});

//route for login
router.post('/login', loginUser);


// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  // Since JWT is stateless, logout is handled client-side by removing the token
  res.json({ message: 'Logout successful (client-side token removal)' });
});

// Optional: Refresh token
router.post('/refresh', authenticateToken, (req, res) => {
  const token = jwt.sign({ id: req.user.id, username: req.user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Token refreshed', token });
});

export default router;