const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Crear un nuevo usuario
router.post('/users', userController.createUser);

// Obtener todos los usuarios
router.get('/users', userController.getAllUsers);

// Actualizar el nombre de un usuario por ID
router.put('/users/:id/name', userController.updateName);

// Actualizar el email de un usuario por ID
router.put('/users/:id/email', userController.updateEmail);

// Eliminar un usuario por ID
router.delete('/users/:id', userController.deleteUser);

// Eliminar todos los usuarios
router.delete('/users', userController.deleteAllUsers);

module.exports = router;
