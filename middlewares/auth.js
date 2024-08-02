require('dotenv').config();

const jwt = require('jsonwebtoken');
const TOKEN_KEY = 'mistatoken3135156asdf';
console.log('TOKEN_KEY:', process.env.TOKEN_KEY);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("el token es (auth.js)", token)

    if (!token) {
        return res.redirect('/login.html');
    }

    try {
        const decoded = jwt.verify(token, TOKEN_KEY); // Reemplaza esto con tu clave secreta
        req.user = decoded; // Asigna el contenido decodificado del token a req.user
        console.log("verificando el req.user.id (auth): ", req.user.id)
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware de autorización
const authorizeRole = (roles) => (req, res, next) => {
    if (roles.includes(req.user.role)) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
};

module.exports = {
    authenticateToken,
    authorizeRole
};