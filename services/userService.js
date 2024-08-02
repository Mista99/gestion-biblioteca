const User = require('../models/userModel');
const Book = require('../models/bookModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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


// Función para registrar un nuevo usuario
exports.registerUser = async (userData) => {
    try {
        const { email } = userData;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error registering user in service:', error.message);
        throw new Error('Error registering user in service');
    }
};
exports.loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        return user;
    } catch (error) {
        console.error('Error logging in user in service:', error.message);
        throw new Error('Error logging in user in service');
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

// Obtener un usuario por ID
exports.getUserBy_Id = async (id) => {
    try {
        const user = await User.findOne({ id }, { password: 0, __v: 0 });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error('Error getting user by ID in service:', error.message);
        throw new Error('Error getting user by ID in service');
    }
};
// Obtener los libros prestados por un usuario por ID
exports.getBorrowedBooks = async (id) => {
    try {
        const user = await User.findOne({ id }, { borrowedBooks: 1});
        if (!user) {
            throw new Error('User not found');
        }
        return user.borrowedBooks;
    } catch (error) {
        console.error('Error getting borrowed books in service:', error.message);
        throw new Error('Error getting borrowed books in service');
    }
};

exports.borrowBook = async (userId, bookIsbn) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Verificar si el libro tiene copias disponibles
        const book = await Book.findOne({ isbn: bookIsbn }).session(session);
        if (!book || book.availableCopies <= 0) {
            throw new Error('No hay copias disponibles del libro.');
        }

        // Actualizar la cantidad de copias disponibles
        console.log("prestando, copias disponibles: ", book)
        book.availableCopies -= 1;
        console.log("prestando, copias luego del prestamo: ", book)
        await book.save({ session });

        // Agregar el libro a la lista de libros prestados del usuario
        const user = await User.findOne({ id: userId }).session(session);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        user.borrowedBooks.push({ bookId: book._id.toString(), title: book.title });
        await user.save({ session });

        // Cometer la transacción
        await session.commitTransaction();
        console.log('Libro prestado exitosamente');
        return book;
    } catch (error) {
        // Abortar la transacción en caso de error
        await session.abortTransaction();
        console.error('Error al prestar el libro:', error);
        throw error;
    } finally {
        session.endSession();
    }
};