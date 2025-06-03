import express from 'express';
import { registerSitter } from '../controllers/sitterController.js';
import protect from '../middlewares/authMiddleware.js';
const router = express.Router();

const sitters = [];

// to create a new sitter
router.post('/register', registerSitter);

//protected route
router.get('/secure/:id', protect, (req, res) => {
    res.send('User does not exist ');
});

// Get all sitters
router.get('/', (req, res) => {
  res.json(sitters);
});

// Get a sitter by ID
router.get('/:id', (req, res) => {
  const sitter = sitters.find(s => s.id === parseInt(req.params.id));
  if (!sitter) return res.status(404).json({ message: 'Sitter not found' });
  res.json(sitter);
});


// Update a sitter
router.put('/:id', (req, res) => {
  const sitter = sitters.find(s => s.id === parseInt(req.params.id));
  if (!sitter) return res.status(404).json({ message: 'Sitter not found' });
  Object.assign(sitter, req.body);
  res.json(sitter);
});

export default router;
