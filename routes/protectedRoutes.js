const express = require('express');
const userService = require('../services/userService')
const User = require('../models/userModel');
const bookService = require('../services/bookService')

const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/auth');

// Ruta para el panel de usuario
router.get('/user-panel', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    try {
        // Obtener el usuario actual desde el middleware o la base de datos
        const user = await userService.getUserBy_Id(req.user.id);
        const borrowedBooks = await userService.getBorrowedBooks(user.id);
        console.log("el usuario es: ", user);
        console.log("buscando usuario despues de validar token (protec-routes): ", user.id);
        
        console.log("datos view: ", borrowedBooks, user)
        res.render('user-panel', {

            user: user
        })
    } catch (error) {
        console.error('Error rendering user panel:', error.message);
        res.status(500).send('Error rendering user panel');
    }
});
// Ruta para obtener los préstamos del usuario
router.get('/api/user-loans', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    try {
        const user = await userService.getUserBy_Id(req.user.id);
        const borrowedBooks = await userService.getBorrowedBooks(user.id);
        res.json({ borrowedBooks });
    } catch (error) {
        console.error('Error fetching user loans:', error.message);
        res.status(500).send('Error fetching user loans');
    }
});

// Ruta para obtener todos los libros de la biblioteca
router.get('/api/library-books', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    try {
        const books = await bookService.findAll();
        res.json({ books });
    } catch (error) {
        console.error('Error fetching library books:', error.message);
        res.status(500).send('Error fetching library books');
    }
});

// Ruta para extender el plazo de un préstamo
router.put('/api/extend-loan/:bookId', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;
    console.log("Verificando datos de llegada: ", userId, bookId);
    
    try {
        const loan = await userService.extendLoan(userId, bookId);
        res.json({ message: 'Plazo de préstamo ampliado', loan });
    } catch (error) {
        console.error('Error extendiendo el plazo del préstamo:', error.message);
        res.status(500).json({ error: `Error extendiendo el plazo del préstamo: ${error.message}` });
    }
});

// Ruta para el panel de administrador
router.get('/admin-panel', authenticateToken, authorizeRole(['admin']), (req, res) => {
    res.send('Welcome to Admin Panel');
});

module.exports = router;