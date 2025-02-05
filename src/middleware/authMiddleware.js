import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../utils/jwtUtils.js';

const secretKey = 'minamabe';

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.authCookie;

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).send('Token no válido');
  }
};


export const createToken = (user) => {
  return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
};