// controllers/userController.js
import { UserProfile } from '../models/user.js';

export const createUser = async (req, res) => {
  try {
    const user = await UserProfile.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserProfile.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserProfile.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const testUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'User route is working ✅' });
  } catch (err) {
    res.status(500).json({ error: 'Error in user test route' });
  }
};
