import { Router } from 'express';
import passport from 'passport';
import User from '../models/User.js';
import Cart from '../models/Carts.js';

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
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send('El correo electrónico ya está registrado');
  }

  const newCart = new Cart();
  await newCart.save();

  const newUser = new User({ first_name, last_name, email, password, cart: newCart._id });

  try {
    await newUser.save();
    res.redirect('/api/sessions/login?message=Registro%20exitoso.%20Por%20favor%20inicia%20sesión.');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect('/api/sessions/login?message=Correo%20electrónico%20no%20registrado.');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.redirect('/api/sessions/login?message=Contraseña%20incorrecta.');
    }

    req.login(user, (err) => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        return res.redirect('/api/sessions/login?message=Error%20de%20autenticación.%20Por%20favor%20verifica%20tus%20credenciales.');
      }
      return res.redirect('/');
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error al iniciar sesión');
  }
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;