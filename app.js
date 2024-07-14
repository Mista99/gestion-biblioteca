const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use('/api', userRoutes);
app.use('/api', bookRoutes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
