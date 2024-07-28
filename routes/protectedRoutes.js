const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Ruta para el panel de usuario
router.get('/user-panel', authenticateToken, authorizeRole(['user', 'admin']), (req, res) => {
    res.send('Welcome to User Panel');
});

// Ruta para el panel de administrador
router.get('/admin-panel', authenticateToken, authorizeRole(['admin']), (req, res) => {
    res.send('Welcome to Admin Panel');
});

module.exports = router;