const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const borrowedBookSchema = new Schema({
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    borrowedDate: { type: Date, default: Date.now },
    returnDate: { 
        type: Date, 
        default: function() {
            return new Date(this.borrowedDate.getTime() + 15 * 24 * 60 * 60 * 1000); // +15 días
        }
    },
    extensionCount: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },  
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Contraseña no requerida al principio
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    borrowedBooks: { type: [borrowedBookSchema], default: [] }
});

// Hook pre-save para hashear la contraseña y asignar una por defecto si no se proporciona
userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password') || this.isNew) {
            // Verificar si la contraseña ya está hasheada
            const isHashed = this.password.startsWith('$2b$'); // Comprobar si es un hash de bcrypt
            if (!isHashed) {
                this.password = await bcrypt.hash(this.password, 10); // Hashear solo si no está hasheada
            }
        }
        next();
    } catch (err) {
        next(err);
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
