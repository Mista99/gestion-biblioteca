const express = require('express');
const userController = require('../controllers/userController');
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
router.get('/settings', authenticateToken, authorizeRole(['user', 'admin']), async (req, res) => {
    res.render('settings', {
    })
});

// Ruta para el panel de administrador
router.get('/admin-panel', authenticateToken, authorizeRole(['admin']), (req, res) => {
    res.render('admin-panel', {
    })
});
router.get('/api/username', authenticateToken, authorizeRole(['user', 'admin']), userController.getUserName);
//router.get('/api/users/name', userController.getUserName);

router.get('/api/useremail', authenticateToken, authorizeRole(['user', 'admin']), userController.getUserEmail);

router.get('/api/users', authenticateToken, authorizeRole(['admin']), userController.getAllUsers);
// Ruta para cambiar el nombre
router.put('/api/users/:id/name', authenticateToken, authorizeRole(['admin']), userController.updateName);
// Ruta para cambiar el correo electrónico
router.put('/api/users/:id/email', authenticateToken, authorizeRole(['admin']), userController.updateEmail);
// Ruta para cambiar la contraseña
router.put('/api/updatePassword', authenticateToken, authorizeRole(['user', 'admin']), userController.updatePassword);
router.delete('/api/users/:id', authenticateToken, authorizeRole(['admin']), userController.deleteUser);
//new puts sin fallos de seguridad
// Ruta para cambiar el nombre

//------------------actuializar datos solo con autenticacion:------------------------------//
router.put('/api/username', authenticateToken, authorizeRole(['user', 'admin']), userController.putName);
router.put('/api/useremail', authenticateToken, authorizeRole(['user', 'admin']), userController.putEmail);
router.put('/api/userpass', authenticateToken, authorizeRole(['user', 'admin']), userController.putPassword);
//----------------------------------------------------------------------------------//
//----------Books--------------//
router.post('/api/borrowBook', authenticateToken, authorizeRole(['admin']), userController.borrowBook);
router.get('/api/borrowBook', authenticateToken, authorizeRole(['admin']), userController.getBorrowedBooks);

// // Actualizar el nombre de un usuario por ID
// router.put('/users/:id/name', userController.updateName);

// // Actualizar el email de un usuario por ID
// router.put('/users/:id/email', userController.updateEmail);

module.exports = router;