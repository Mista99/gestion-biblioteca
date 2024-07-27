const Book = require('../models/bookModel');

class BookService {
  static async create(book) {
    const newBook = new Book(book);
    await newBook.save();
  }

  static async update(isbn, prop, value) {
    const update = {};
    update[prop] = value;

    // Actualiza el libro con la propiedad dada
    await Book.updateOne({ isbn: isbn }, { $set: update });

    // Busca el libro actualizado y lo devuelve
    const updatedBook = await Book.findOne({ isbn }).lean();
    
    // Verifica si el libro fue encontrado y actualizado
    if (!updatedBook) {
      throw new Error(`Book with ISBN ${isbn} not found`);
    }

    return updatedBook;
  }
  
  static async findAll() {
    return await Book.find().select('-_id -__v');
  }
  
  static async deleteAll() {
    await Book.deleteMany();
  }

  static async delete(isbn) {
    await Book.deleteOne({ isbn: isbn });
  }
}

module.exports = BookService;
