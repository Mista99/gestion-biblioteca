const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.delete('/users', userController.deleteAllUsers);
router.put('/users/name', userController.updateUserName);
router.put('/users/email', userController.updateUserEmail);

module.exports = router;
