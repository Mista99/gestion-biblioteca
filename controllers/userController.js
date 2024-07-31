const jwt = require('jsonwebtoken');
const userService = require('../services/userService');


const TOKEN_KEY = process.env.TOKEN_KEY;
console.log("clave s", TOKEN_KEY);

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    console.log('Contenido de req.body:', req.body);

    // console.log('Datos recibidos para crear usuario:', uss);

    try {
        const user = await userService.createUser(req.body);
        console.log('Usuario creado exitosamente:', user);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(400).json({ error: 'Error creating user' });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { id, name, email, password, role } = req.body;
        const user = await userService.registerUser({ id, name, email, password, role });
        res.status(201).send({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(400).send({ error: `Error registering user: ${error.message}` });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Attempting to login user with email:', email, password);

        const user = await userService.loginUser(email, password);

        if (user) {
            // Genera un token JWT
            console.log("verificando el TOKEN_Key en el controlador: ", TOKEN_KEY)
            const token = jwt.sign(
                { id: user._id, role: user.role },
                TOKEN_KEY,
                { expiresIn: '1h' }
            );
            console.log("token generado en el controlador: ", token)
            // Configura la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,    // La cookie no es accesible desde JavaScript en el lado del cliente
                secure: true,      // La cookie solo se envía a través de HTTPS
                sameSite: 'None',  // La cookie se envía en solicitudes entre sitios
                maxAge: 24 * 60 * 60 * 1000 // Duración de la cookie: 24 horas
            });
            res.status(200).json({ message: 'User authenticated successfully', userId: user._id });
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ error: 'Error logging in user' });
    }
};
// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error.message);
        res.status(500).json({ error: 'Error getting users' });
    }
};

// Actualizar el nombre de un usuario por ID
exports.updateName = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const updatedUser = await userService.updateName(id, name);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating name:', error.message);
        res.status(500).json({ error: 'Error updating name' });
    }
};

// Actualizar el email de un usuario por ID
exports.updateEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const updatedUser = await userService.updateEmail(id, email);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating email:', error.message);
        res.status(500).json({ error: 'Error updating email' });
    }
};


// Controlador para eliminar un usuario por ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del parámetro de la ruta
        console.log(`Attempting to delete user with ID: ${id}`);
        const result = await userService.deleteUser(id);

        if (result.deletedCount === 0) {
            // No se encontró ningún usuario con ese ID
            return res.status(404).json({ message: `Usuario con ID ${id} no encontrado` });
        }
        console.log(`User with ID: ${id} deleted successfully`);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};

// Eliminar todos los usuarios
exports.deleteAllUsers = async (req, res) => {
    try {
        await userService.deleteAllUsers();
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting all users:', error.message);
        res.status(500).json({ error: 'Error deleting all users' });
    }
};
