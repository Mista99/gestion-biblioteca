const User = require('../models/userModel');
//exports. significa de este mofulo exporte estom por lo que ucando voy a usar la funcion hago: userController.createUser
exports.createUser = (req, res) => {
    const newUser = new User(req.body.id, req.body.name, req.body.email);
    User.create(newUser, (err, result) => {
        if (err) {
            return res.status(500).send('Error creating user');
        }
        res.status(201).send('User created successfully');
    });
};
// userController.js

exports.updateUserName = (req, res) => {
    const { id, name } = req.body;
    User.updateName(id, name, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating user name' });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User name updated successfully', changes: result.changes });
    });
};

exports.updateUserEmail = (req, res) => {
    const { id, email } = req.body;
    User.updateEmail(id, email, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating user email' });
        }
        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User email updated successfully', changes: result.changes });
    });
};


exports.getAllUsers = (req, res) => {
    User.findAll((err, users) => {
        if (err) {
            return res.status(500).send('Error fetching users');
        }
        res.json(users);
    });
};
exports.deleteUser = (req, res) => {
    User.delete((err) => {
        if (err) {
            return res.status(500).send('Error deleting user');
        }
        res.status(200).send('User deleted successfully');
    });
};

exports.deleteAllUsers = (req, res) => {
    isbn = req.body.isbn;
    User.deleteAll((err) => {
        if (err) {
            return res.status(500).send('Error deleting users');
        }
        res.status(200).send('All users deleted successfully');
    });
};
