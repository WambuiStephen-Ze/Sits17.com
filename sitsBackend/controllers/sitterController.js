// controllers/sitterController.js
import { SitterProfile } from '../models/sitter.js';

export const createSitter = async (req, res) => {
  try {
    const sitter = await SitterProfile.create(req.body);
    res.status(201).json(sitter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSitters = async (req, res) => {
  try {
    const sitters = await SitterProfile.findAll();
    res.status(200).json(sitters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSitterById = async (req, res) => {
  try {
    const sitter = await SitterProfile.findByPk(req.params.id);
    if (!sitter) return res.status(404).json({ message: 'Sitter not found' });
    res.status(200).json(sitter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
