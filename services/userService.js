const User = require('../models/userModel');

// Crear un nuevo usuario
exports.createUser = async (uss) => {
    try {
        console.log('Intentando crear un nuevo usuario EN userservice con:', uss);
        const newUser = new User(uss); // Añadir un password por defecto si es necesario
        await newUser.save();
        console.log('Usuario creado exitosamente en el servicio:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error al crear el usuario en el servicio:', error.message);
        throw new Error(error.message);
    }
};

exports.getAllUsers = async () => {
    return await User.find({}, { password: 0, __v: 0, _id: 0 }).lean();
  };
  
// Actualizar el nombre de un usuario por ID
exports.updateName = async (id, name) => {
    return await User.findOneAndUpdate({ id }, { name }, { new: true });
};

// Actualizar el email de un usuario por ID
exports.updateEmail = async (id, email) => {
    return await User.findOneAndUpdate({ id }, { email }, { new: true });
};

// Actualizar la contraseña de usuario
exports.updatePassword = async (id, password) => {
    return await User.findByIdAndUpdate(id, { password }, { new: true });
};

// Eliminar un usuario por ID
exports.deleteUser = async (id) => {
    try {
        const result = await User.deleteOne({ id });
        return result;
    } catch (error) {
        console.error('Error deleting user in service:', error);
        throw new Error('Error al eliminar el usuario del servidor');
    }
};

// Eliminar todos los usuarios
exports.deleteAllUsers = async () => {
    await User.deleteMany();
};
