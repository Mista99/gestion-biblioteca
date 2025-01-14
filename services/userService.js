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
        throw new Error(error.message);
    }
};
exports.loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        const role = user.role;
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        console.log("usuario encontrado: ")
        console.log(user)
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
    console.log("-----Entrnado a userService-----")
    return await User.findByIdAndUpdate(id, { password }, { new: true });
};
//------------------actuializar datos solo con autenticacion:------------------------------//
// Función para actualizar el nombre de usuario
exports.putUserName = async (userId, newName) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        user.name = newName;
        await user.save();
    } catch (error) {
        throw new Error('Error actualizando el nombre de usuario.');
    }
  };
  
  // Función para actualizar el correo electrónico
exports.putUserEmail = async (userId, newEmail) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
  
        user.email = newEmail;
        await user.save();
    } catch (error) {
        throw new Error('Error actualizando el correo electrónico.');
    }
  };
  
  // Función para actualizar la contraseña
  exports.putUserPassword = async (userId, newPassword) => {
    try {
        console.log("--------------Entrando en putUserPassword (userService)-----------------");
        console.log("ID del usuario:", userId);
        console.log("Nueva contraseña recibida:", newPassword);

        const user = await User.findById(userId);
        if (!user) {
            console.error('Usuario no encontrado.');
            throw new Error('Usuario no encontrado.');
        }
        
        console.log("Usuario encontrado:", user);

        if (!newPassword) {
            console.error('Contraseña nueva no válida.');
            throw new Error('Contraseña nueva no válida.');
        }

        console.log("-----Hasheando la nueva contraseña-----");
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("Contraseña hasheada:", hashedPassword);

        user.password = hashedPassword;
        await user.save();

        console.log("Contraseña actualizada correctamente para el usuario:", userId);
    } catch (error) {
        console.error('Error en putUserPassword:', error);
        throw new Error('Error actualizando la contraseña.');
    }
};

//-------------------------------------------------------------------------------------//
exports.verifyPassword = async (user, currentPassword) => {
    try {
        // Comparar la contraseña ingresada por el usuario con la que está almacenada (que está cifrada)
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        return isMatch; // Retorna true si las contraseñas coinciden, de lo contrario false
    } catch (error) {
        console.error('Error verifying password:', error.message);
        throw new Error('Error verifying password');
    }
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
//obtener un usuario por Id pero solo si se autentica con el token
exports.getUserNameById = async (userId) => {
    try {
        const user = await User.findById(userId); // Asegúrate de tener el modelo User importado
        console.log("Controlador, obteniendo el nombre:")
        console.log(user)

        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user.name;
    } catch (error) {
        throw new Error(`Error al obtener el nombre del usuario: ${error.message}`);
    }
};
//obtener el emanil del usuario pero solo si se autentica con el token
exports.getUserEmailById = async (userId) => {
    try {
        const user = await User.findById(userId); // Asegúrate de tener el modelo User importado
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user.email;
    } catch (error) {
        throw new Error(`Error al obtener el correo electrónico del usuario: ${error.message}`);
    }
};
// Obtener un usuario por ID
exports.getUserBy_Id = async (_id) => {
    try {
        const user = await User.findOne({ _id }, { password: 0, __v: 0 });
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
        throw new Error(`Error getting borrowed books in service: ${error.message}`);
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
// Función para buscar un préstamo por bookId
exports.getLoanByBookId = async (userId, bookId) => {
    try {
        const user = await User.findOne({ _id: userId, 'borrowedBooks.bookId': bookId }, { 'borrowedBooks.$': 1 }).exec();
        if (!user || !user.borrowedBooks.length) {
            throw new Error('Préstamo no encontrado');
        }
        
        return user.borrowedBooks[0];
    } catch (error) {
        console.error('Error buscando el préstamo:', error);
        throw error;
    }
}

// Función para extender el préstamo
exports.extendLoan = async (userId, bookId) => {
    const user = await User.findOne({ _id: userId, 'borrowedBooks.bookId': bookId }, { 'borrowedBooks.$': 1 }).exec();
    
    if (!user || !user.borrowedBooks.length) {
        throw new Error('Préstamo no encontrado');
    }

    const loan = user.borrowedBooks[0]; // Asume que solo hay un préstamo con el bookId proporcionado

    // Verificar el número de extensiones
    if (loan.extensionCount >= 2) {
        throw new Error('Límite de extensiones alcanzado');
    }

    // Ampliar el plazo del préstamo
    loan.returnDate = new Date(loan.returnDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    loan.extensionCount = (loan.extensionCount || 0) + 1; // Incrementar el conteo de extensiones

    // Guardar el usuario actualizado
    await User.updateOne(
        { _id: userId, 'borrowedBooks.bookId': bookId },
        { $set: { 'borrowedBooks.$.returnDate': loan.returnDate, 'borrowedBooks.$.extensionCount': loan.extensionCount } }
    );

    return loan;
}

// // Extender el plazo del préstamo
// exports.extendLoan = async (userId, loanId, newReturnDate) => {
//     try {
//         const user = await User.findOne({ id: userId }).exec();
//         if (user) {
//             const loan = user.borrowedBooks.bookId(loanId); // Busca el préstamo por ID
//             if (loan) {
//                 loan.returnDate = new Date(newReturnDate);
//                 await user.save();
//                 return user.borrowedBooks;
//             } else {
//                 throw new Error('Loan not found');
//             }
//         } else {
//             throw new Error('User not found');
//         }
//     } catch (error) {
//         throw new Error('Error extending loan: ' + error.message);
//     }
// }