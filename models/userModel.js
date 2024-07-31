const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const borrowedBookSchema = new Schema({
    bookId: { type: String, required: true },
    title: { type: String, required: true },
    borrowedDate: { type: Date, default: Date.now },
    returnDate: { type: Date }
}, { _id: false });

const userSchema = new Schema({
    id: { type: String, required: true, unique: true }, // cédula del usuario
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // nuevo campo role
    borrowedBooks: { type: [borrowedBookSchema], default: [] } // nuevo campo borrowedBooks
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
