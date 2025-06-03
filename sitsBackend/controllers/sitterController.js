import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Sitter } from '../models/index.js';

dotenv.config();

// Generate JWT token
const generateToken = (sitter) => {
  return jwt.sign({ id: sitter.id, email: sitter.email, role: 'sitter' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Register a new sitter
export const registerSitter = async (req, res) => {
  try {
    const { name, email, password, profilePic, location, experience, availability } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Checking if sitter already exists
    const existingSitter = await Sitter.findOne({ where: { email } });
    if (existingSitter) {
      return res.status(400).json({ message: 'Sitter with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create sitter
    const sitter = await Sitter.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
      location,
      experience,
      availability,
    });

    // Generate JWT token
    const token = generateToken(sitter);

    res.status(201).json({ sitter, token });
  } catch (err) {
    console.error('Sitter registration error:', err);
    res.status(500).json({ message: 'Sitter registration failed', error: err.message });
  }
};

// Get all sitters
export const getAllSitters = async (req, res) => {
  try {
    const sitters = await Sitter.findAll();
    res.status(200).json(sitters);
  } catch (err) {
    console.error('Error fetching sitters:', err);
    res.status(500).json({ message: 'Error fetching sitters', error: err.message });
  }
};

// Get a sitter by ID
export const getSitterById = async (req, res) => {
  try {
    const sitter = await Sitter.findByPk(req.params.id);
    if (!sitter) return res.status(404).json({ message: 'Sitter not found' });
    res.status(200).json(sitter);
  } catch (err) {
    console.error('Error fetching sitter:', err);
    res.status(500).json({ message: 'Error fetching sitter', error: err.message });
  }
};

// Update sitter profile
export const updateSitter = async (req, res) => {
  try {
    const sitter = await Sitter.findByPk(req.params.id);
    if (!sitter) return res.status(404).json({ message: 'Sitter not found' });

    await sitter.update(req.body);
    res.status(200).json({ message: 'Sitter updated successfully', sitter });
  } catch (err) {
    console.error('Error updating sitter:', err);
    res.status(500).json({ message: 'Error updating sitter', error: err.message });
  }
};