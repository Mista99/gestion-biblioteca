const BookService = require('../services/bookService');

exports.createBook = async (req, res) => {
  const { isbn, title, author, genre, publisher, publicationYear, location, loanStatus, summary, availableCopies } = req.body;
  
  try {
    const newBook = await BookService.create({ isbn, title, author, genre, publisher, publicationYear, location, loanStatus, summary, availableCopies });
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (err) {
    console.error('Error creating book:', err);
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await BookService.findAll();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).send('Error fetching books');
  }
};

exports.deleteAllBooks = async (req, res) => {
  try {
    await BookService.deleteAll();
    res.status(200).send('All books deleted successfully');
  } catch (err) {
    console.error('Error deleting books:', err);
    res.status(500).send('Error deleting books');
  }
};

exports.deleteBooks = async (req, res) => {
  const { isbn } = req.params;

  try {
    await BookService.delete(isbn);
    res.status(200).send('Book deleted successfully');
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Error deleting book');
  }
};

exports.updateProp = async (req, res) => {
  const { isbn } = req.params;
  const { prop, value } = req.body;

  console.log(`Updating book with ISBN: ${isbn}`);
  console.log(`Property to update: ${prop}`);
  console.log(`New value: ${value}`);

  const allowedProps = ['title', 'author', 'genre', 'publisher', 'publicationYear', 'location', 'loanStatus', 'summary'];
  if (!allowedProps.includes(prop)) {
    console.log('Invalid property');
    return res.status(400).json({ error: 'Invalid property' });
  }

  try {
    const updatedBook = await BookService.update(isbn, prop, value);
    if (!updatedBook) {
      console.log(`Book with ISBN ${isbn} not found`);
      return res.status(404).json({ error: `Book with ISBN ${isbn} not found` });
    }
    console.log('Book updated successfully:', updatedBook);
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error('Error updating book:', err);
    res.status(500).json({ error: 'Error updating book' });
  }
};
