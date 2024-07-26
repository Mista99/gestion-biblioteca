require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');


const app = express();
const port = process.env.PORT ?? 3000;
app.use(express.json()); // Middleware para parsear JSON


// Conectar a la base de datos
connectDB();

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use('/api', userRoutes); //la palabra api queda para todas las rutas que se usen ahora
app.use('/api', bookRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
