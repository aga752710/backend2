import User from '../models/User.js';
import { verifyToken } from '../utils/jwtUtils.js';

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.authCookie;

  if (!token) {
    return res.status(401).json({ message: 'No estás autenticado' });
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