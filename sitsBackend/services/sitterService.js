import { Sitter } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerNewSitter = async ({ name, email, password }) => {
  const existing = await Sitter.findOne({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newSitter = await Sitter.create({
    name,
    email,
    password: hashedPassword,
  });

  // Optionally: generate JWT token
  // const token = jwt.sign({ id: newSitter.id }, process.env.JWT_SECRET);

  return newSitter;
};
