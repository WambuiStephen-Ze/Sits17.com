import jwt from 'jsonwebtoken';

<<<<<<< HEAD
// const JWT_SECRET = process.env.JWT_SECRET || 'Sitter_Project_2025_TechCrush_Group17_@#Xf93kL';
=======
const JWT_SECRET = process.env.JWT_SECRET || 'Sitter_Project_2025_TechCrush_Group17_@#Xf93kL';
>>>>>>> 0cbaadcae15f56d7d23e4df7d75a52e74b14a243

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Wrong token'});
  }  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });

  req.user = decoded;
 next();}};