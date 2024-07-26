const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String, required: true, unique: true }, // cedula del usuario
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
