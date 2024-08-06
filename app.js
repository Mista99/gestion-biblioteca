require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Asegúrate de requerir cookie-parser

const connectDB = require('./config/database');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const protectedRoutes = require('./routes/protectedRoutes');


const app = express();
const port = process.env.PORT ?? 3000;
app.use(express.json()); // Middleware para parsear JSON
app.use(cookieParser());

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DBNAME = process.env.MONGO_DBNAME;
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@library0.t6p18uw.mongodb.net/${MONGO_DBNAME}?retryWrites=true&w=majority&appName=library0`;

console.log("Mongo URI:", MONGO_URI); // Para verificar que se está cargando correctamente

// Conectar a la base de datos
connectDB(MONGO_URI);

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true // Permite el envío de credenciales (cookies)
}));
// Configura EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configura el directorio de archivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', userRoutes); //la palabra api queda para todas las rutas que se usen ahora
app.use('/api', bookRoutes);
// Rutas protegidas
app.use(protectedRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
