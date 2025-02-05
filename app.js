import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from './src/config/passportConfig.js';
import authRoutes from './src/routes/authRoutes.js';
import { isAuthenticated } from './src/middleware/authMiddleware.js';

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://minamabeariza:96oprKR7PiRkjMV9@ariel.psiy5.mongodb.net/Backend2?retryWrites=true&w=majority');
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
};

connectDB();

// Configuración de Handlebars
app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(session({
  secret: 'minamabe',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', authRoutes);
app.use(isAuthenticated);

app.get('/', (req, res) => {
  const user = req.user;
  res.render('home', { title: 'Bienvenido al registro de usuario', user: user || null });
});

app.listen(8080, () => {
  console.log('Servidor funcionando en http://localhost:8080');
});
