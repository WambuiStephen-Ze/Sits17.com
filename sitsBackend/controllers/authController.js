import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserProfile } from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, profilePic, location, numberOfChildren } = req.body;

    const existingUser = await UserProfile.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserProfile.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
      location,
      numberOfChildren
    });

    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    next(err);
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserProfile.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};
