import express from 'express';
const router = express.Router();
import { createUser, getUserById, updateUser } from '../models/index.js';
import protect from '../middlewares/authMiddleware.js';
import { loginUser } from '../controllers/authController.js';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, profilePic, location, numberOfChildren } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await createUser({ name, email, password, role, profilePic, location, numberOfChildren });
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', loginUser);
router.post('/logout', protect, (req, res) => res.json({ message: 'Logout successful (client-side token removal)' }));
router.post('/refresh', protect, (req, res) => {
  const token = jwt.sign({ id: req.user.id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Token refreshed', token });
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const user = await updateUser(req.user.id, updates);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/me', protect, async (req, res) => {
  try {
    await getUserById(req.user.id); // Verify user exists
    await User.destroy({ where: { id: req.user.id } }); // Assuming User is available in scope
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;