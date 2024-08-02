const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  isbn: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publisher: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  location: { type: String, required: true },
  loanStatus: { type: String, required: true },
  summary: { type: String, required: true },
  availableCopies: {type: Number, required: true, default: 1 }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
