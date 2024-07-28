const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Reemplaza esto con tu clave secreta
        req.user = decoded; // Asigna el contenido decodificado del token a req.user
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