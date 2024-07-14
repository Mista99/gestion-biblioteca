const User = require('../models/userModel');

exports.createUser = (req, res) => {
    const newUser = new User(null, req.body.name, req.body.email);
    User.create(newUser, (err, result) => {
        if (err) {
            return res.status(500).send('Error creating user');
        }
        res.status(201).send('User created successfully');
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

exports.deleteAllUsers = (req, res) => {
    User.deleteAll((err) => {
        if (err) {
            return res.status(500).send('Error deleting users');
        }
        res.status(200).send('All users deleted successfully');
    });
};
