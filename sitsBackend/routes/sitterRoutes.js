import express from 'express';
import { registerSitter } from '../controllers/sitterController.js';
import protect from '../middlewares/authMiddleware.js';

import { getAllSitters, getSitterById, updateSitter } from '../models/index.js';

const router = express.Router();

// Create a new sitter
router.post('/register', registerSitter);

// Get all sitters
router.get('/', async (req, res) => {
  try {
    const sitters = await getAllSitters();
    res.json(sitters);
  } catch (error) {
    console.error('Error fetching sitters:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a sitter by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const sitter = await getSitterById(parseInt(req.params.id));
    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }
    res.json(sitter);
  } catch (error) {
    console.error('Error fetching sitter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a sitter
router.put('/:id', protect, async (req, res) => {
  try {
    const sitter = await getSitterById(parseInt(req.params.id));
    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }
    if (req.user.id !== sitter.id) {
      return res.status(403).json({ message: 'Access denied to update this sitter' });
    }
    const updates = req.body;
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const updatedSitter = await updateSitter(sitter.id, updates);
    res.json(updatedSitter);
  } catch (error) {
    console.error('Error updating sitter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a sitter
router.delete('/:id', protect, async (req, res) => {
  try {
    const sitter = await getSitterById(parseInt(req.params.id));
    if (!sitter) {
      return res.status(404).json({ message: 'Sitter not found' });
    }
    if (req.user.id !== sitter.id) {
      return res.status(403).json({ message: 'Only the sitter can delete their profile' });
    }
    await Sitter.destroy({ where: { id: parseInt(req.params.id) } }); // Assuming Sitter is available
    res.json({ message: 'Sitter profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting sitter:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
