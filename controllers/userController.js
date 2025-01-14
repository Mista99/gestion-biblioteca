const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const z = require('zod')


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

// Definir el esquema de usuario
const userSchema = z.object({
    id: z.number().min(2, "El ID es requerido"),
    name: z.string().min(2, "El nombre es requerido"),
    email: z.string().email("El correo electrónico no es válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    vpassword: z.string().min(8, "La verificación de contraseña debe tener al menos 8 caracteres")
  }).refine(data => data.password === data.vpassword, {
    message: "Las contraseñas no coinciden",
    path: ["vpassword"],
  });
  
  // Función para registrar usuario
// Función para registrar usuario
exports.registerUser = async (req, res) => {
    try {
        // Valida y analiza los datos del cuerpo de la solicitud
        req.body.id = Number(req.body.id);
        const userData = userSchema.parse(req.body);
        const { id, name, email, password } = userData;

        // Registra al usuario
        const user = await userService.registerUser({ id, name, email, password });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Mapea los errores de Zod a un formato adecuado sin el path
            const formattedErrors = error.issues.map(issue => ({
                message: issue.message
            }));
            return res.status(400).json({ errors: formattedErrors });
        }

        // Maneja otros errores
        console.error('Error registrando usuario:', error.message);
        res.status(500).json({ error: `Error registrando usuario: ${error.message}` });
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
            res.status(200).json({ message: 'User authenticated successfully', role: user.role });
            
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ error: 'Error logging in user' });
    }
};
exports.logOut = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch (error) {
        console.error('Error logging out user:', error.message);
        res.status(500).json({ error: 'Error logging out user' });
    }
}
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
// Controlador para obtener el nombre del usuario
exports.getUserName = async (req, res) => {
    try {
        const userId = req.user.id; // Asegúrate de que el middleware `authenticateToken` agregue el userId al request
        console.log("userId: ", userId)
        const userName = await userService.getUserNameById(userId);
        console.log("Controlador, obteniendo el nombre:")
        console.log(userName)

        res.status(200).json({ name: userName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener el correo electrónico del usuario
exports.getUserEmail = async (req, res) => {
    try {
        const userId = req.user.id; // Asegúrate de que el middleware `authenticateToken` agregue el userId al request
        const userEmail = await userService.getUserEmailById(userId);
        res.status(200).json({ email: userEmail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//------------------actuializar datos solo con autenticacion:------------------------------//
// Actualizar el nombre de usuario
exports.putName = async (req, res) => {
    try {
        const userId = req.user.id; // Extraemos el id desde el token
        console.log("el usereId es: ", userId);
        const user = await userService.getUserBy_Id(userId);
        console.log("el id de usuario es: ", user.id)
        const { newName } = req.body;
        const nName = newName.name;
        console.log("leyendo el newName: ", newName);

        if (!newName) {
            return res.status(400).json({ message: 'El nuevo nombre es requerido.' });
        }

        await userService.updateName(user.id, nName);
        res.status(200).json({ message: 'Nombre de usuario actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el nombre de usuario.', error });
    }
};

// Actualizar el correo electrónico
exports.putEmail = async (req, res) => {
    try {
        console.log("--------------ingresando al controlador del correo-------------")
        const userId = req.user.id;
        const user = await userService.getUserBy_Id(userId);
        console.log("el id de usuario es: ", user.id)
        const { newEmail } = req.body;
        console.log("leyendo el newEmail: ", newEmail.email);

        if (!newEmail) {
            return res.status(400).json({ message: 'El nuevo correo electrónico es requerido.' });
        }

        await userService.updateEmail(user.id, newEmail.email);
        res.status(200).json({ message: 'Correo electrónico actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el correo electrónico.', error });
    }
};

// Actualizar la contraseña
exports.putPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserBy_Id(userId);
        console.log("------el id de usuario es: (PASSWORD) ------ ", user.id)

        const { newPassword } = req.body;
        console.log("leyendo el newPassword: ", newPassword);

        if (!newPassword) {
            return res.status(400).json({ message: 'La nueva contraseña es requerida.' });
        }

        await userService.putUserPassword(userId, newPassword);
        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando la contraseña.', error });
    }
};
//----------------------------------------------------------------------------------//
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

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Verifica que se hayan proporcionado ambas contraseñas
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current and new passwords are required' });
        }

        // Obtener el ID del usuario desde el token de autenticación
        const userId = req.user.id;  // req.user.id se debe haber asignado al verificar el token
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si la contraseña actual es correcta
        const isMatch = await userService.verifyPassword(user, currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        // Actualizar la contraseña
        const updatedUser = await userService.updatePassword(userId, newPassword);
        if (!updatedUser) {
            return res.status(500).json({ error: 'Error updating password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ error: 'Error updating password' });
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

exports.borrowBook = async (req, res) => {
    const { id, isbn } = req.body;
    console.log("recibiendo datos: ", id, isbn)
    try {
        const book = await userService.borrowBook(id, isbn);
        res.status(200).json({ message: 'Libro prestado exitosamente', book });
    } catch (error) {
        res.status(500).json({ error: `Error al prestar el libro: ${error.message}` });
    }
};
exports.getBorrowedBooks = async (req, res) => {
    const { id } = req.body;
    console.log("recibiendo datos: ", id)
    try {
        const books = await userService.getBorrowedBooks(id);
        res.status(200).json({ books });
        } 
    catch (error) {
        res.status(500).json({ error: `${error.message}`});
    }
}
