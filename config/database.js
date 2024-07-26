require('dotenv').config();
const mongoose = require('mongoose');

const user = 'admin-library';
const password = 'MnCzi0ncX47go2LI';
const BD = "Biblioteca";
const uri = `mongodb+srv://admin-library:${password}@library0.t6p18uw.mongodb.net/${BD}?retryWrites=true&w=majority&appName=library0`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Termina la aplicación si no puede conectarse
  }
};

module.exports = connectDB;
