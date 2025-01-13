const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// Crear un nuevo usuario
router.post('/users', userController.createUser);

// Registro de usuario (puede incluir opción para registrar administradores)
router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);
router.get('/login', (req, res)=>{res.render('login')});

router.get('/admin-panel', (req, res)=>{res.render('admin-panel')});

router.post('/logout', userController.logOut);

// Obtener todos los usuarios
router.get('/users', userController.getAllUsers);
//router.get('/username', userController.getUserName);
//obtener el role del usuario
//router.put('/users/:id/name', userController.updateName);

// Actualizar el email de un usuario por ID
//router.put('/users/:id/email', userController.updateEmail);

// Eliminar un usuario por ID
// router.delete('/users/:id', userController.deleteUser);

// Eliminar todos los usuarios
//router.post('/borrowBook', userController.borrowBook);

//router.get('/borrowBook', userController.getBorrowedBooks);

module.exports = router;
