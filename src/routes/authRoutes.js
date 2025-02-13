import { Router } from 'express';
import passport from 'passport';
import User from '../models/User.js';
import Cart from '../models/Carts.js';
import { createToken } from '../utils/jwtUtils.js';
import { sendResponse } from '../utils/responseHandler.js';

const router = Router();


router.get('/register', (req, res) => {
  const message = req.query.message;
  res.render('register', { message });
});


router.get('/login', (req, res) => {
  const message = req.query.message;
  res.render('login', { message });
});


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const existingUser  = await User.findOne({ email });

  if (existingUser ) {
    return sendResponse(res, 400, 'El correo electrónico ya está registrado');
  }

  const newCart = new Cart();
  await newCart.save();

  const newUser  = new User({ first_name, last_name, email, password, cart: newCart._id });

  try {
    await newUser .save();
    res.redirect('/api/sessions/login?message=Registro%20exitoso.%20Por%20favor%20inicia%20sesión.');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return sendResponse(res, 500, 'Error al registrar el usuario');
  }
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); 
    }
    if (!user) {
      
      return res.redirect('/api/sessions/login?message=' + encodeURIComponent(info.message));
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/'); 
    });
  })(req, res, next);
});


router.post('/login-jwt', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.redirect('/api/sessions/login?message=Credenciales%20incorrectas');
  }

  const token = createToken(user); 
  res.cookie('authCookie', token, { httpOnly: true });

  return res.redirect('/');
});


router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


router.get('/current', (req, res) => {
  if (req.user) {
    return res.json({
      status: 'success',
      user: req.user,
    });
  }
  res.status(401).json({
    status: 'error',
    message: 'No estás autenticado',
  });
});

export default router;