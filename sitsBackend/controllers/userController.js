import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../services/userService.js';
import { createUser, getUserById, updateUser } from '../services/userService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email,  }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const registerParent = async (req, res) => {
  try {
    const { firstname, lastname, email, password, profilePic, location, numberOfChildren } = req.body;

    // Validate required fields
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: 'first name, last name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await getUserById(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      firstname,
      lastname,
      username,
      contact,
      email,
      password: hashedPassword,
      profilePic,
      location,
      numberOfChildren,
    });

    // Generate and return JWT token
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Parent registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

//login user


export const loginParent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email); // corrected function name
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//getting users
export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

//updating user data
export const updateUserData = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};