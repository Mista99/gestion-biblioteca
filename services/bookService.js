const Book = require('../models/bookModel');

class BookService {
  static async create(book) {
    const newBook = new Book(book);
    await newBook.save();
  }

  static async update(isbn, prop, value) {
    const update = {};
    update[prop] = value;
    await Book.updateOne({ isbn: isbn }, { $set: update });
  }

  static async findAll() {
    return await Book.find();
  }

  static async deleteAll() {
    await Book.deleteMany();
  }

  static async delete(isbn) {
    await Book.deleteOne({ isbn: isbn });
  }
}

module.exports = BookService;
