// sitterRoutes.js

import express from 'express';
import {
  registerSitter,
  loginSitter,
  getAllSitters,
  getSitterById,
  updateSitter,
  getSitterProfileWithStatus
} from '../controllers/sitterController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register a new sitter
router.post('/register', registerSitter);

// Login
router.post('/login', loginSitter);

// Get all sitters
router.get('/', getAllSitters);

// Get a sitter by ID
router.get('/:id', protect, getSitterById);

// Update a sitter
router.put('/:id', protect, updateSitter);

// Get sitter profile with booking status (used in frontend display)
router.get('/profile/:id', getSitterProfileWithStatus);

// Delete a sitter
router.delete('/:id', protect, async (req, res) => {
  try {
    const { Sitter } = await import('../models/index.js');
    const sitter = await Sitter.findByPk(parseInt(req.params.id));

    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }

    if (req.user.id !== sitter.id) {
      return res.status(403).json({ message: 'Only the sitter can delete their profile' });
    }

    await Sitter.destroy({ where: { id: sitter.id } });
    res.json({ message: 'Sitter profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting sitter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
