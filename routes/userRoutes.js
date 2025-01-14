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

module.exports = router;
