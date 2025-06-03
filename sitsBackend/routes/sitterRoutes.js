// routes/sitterRoutes.js
import express from 'express';
import {
  createSitter,
  getAllSitters,
  getSitterById
} from '../controllers/sitterController.js';

const router = express.Router();

router.post('/', createSitter);
router.get('/', getAllSitters);
router.get('/:id', getSitterById);

export default router;
