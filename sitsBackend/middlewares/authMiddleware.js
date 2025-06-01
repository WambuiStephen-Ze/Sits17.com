import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// to Ensure JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Middleware to protect routes by verifying JWT token
const protect = (req, res, next) => {
  try {
    // Getting Authorization header
    const authHeader = req.headers.authorization;

    // to Check if token exists and has the correct format 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Extract the token 
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired, please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
    // Generic error
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

export default protect;






