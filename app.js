import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRoutes from './src/routes/authRoutes.js';
import { isAuthenticated } from './src/middleware/authMiddleware.js';
import passportConfig from './src/config/passportConfig.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine} from 'express-handlebars'
import path from 'path'

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


mongoose.connect('mongodb+srv://minamabeariza:bkj4fFre1c4XuJnZ@ariel.psiy5.mongodb.net/')
.then(() => console.log('Conectado a la base de datos'))
.catch(err => console.error('Error al conectar a la base de datos:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'minamabe',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views')); 

app.set('static', path.join(__dirname, '/public'));
app.use(express.static('public'));

app.use('/api/sessions', authRoutes);


app.get('/protected', isAuthenticated, (req, res) => {
  res.send('Esta es una ruta protegida. Estás autenticado.');
});


app.get('/', (req, res) => {
  res.render('home', { title: 'Página Principal', user: req.user });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});