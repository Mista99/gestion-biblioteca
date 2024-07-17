const Book = require('../models/bookModel');

exports.createBook = (req, res) => {
    const newBook = new Book(
        req.body.isbn,
        req.body.title,
        req.body.author,
        req.body.genre,
        req.body.publisher,
        req.body.publicationYear,
        req.body.location,
        req.body.loanStatus,
        req.body.summary
    );
    Book.create(newBook, (err) => {
        if (err) {
            return res.status(500).send('Error creating book');
        }
        res.status(201).send('Book created successfully');
    });
};

exports.getAllBooks = (req, res) => {
    Book.findAll((err, books) => {
        if (err) {
            return res.status(500).send('Error fetching books');
        }
        res.json(books);
    });
};

exports.deleteAllBooks = (req, res) => {
    Book.deleteAll((err) => {
        if (err) {
            return res.status(500).send('Error deleting books');
        }
        res.status(200).send('All books deleted successfully');
    });
};
exports.deleteBooks = (req, res) => {
    Book.delete(req.params.isbn, (err) => {
        if (err) {
            return res.status(500).send('Error deleting book');
            }
            res.status(200).send('Book deleted successfully');
        });
}
exports.updateProp = (req, res) => {
    const isbn = req.params.isbn;
    const { prop, value } = req.body;

    // Log de depuración
    console.log(`Updating book with ISBN: ${isbn}`);
    console.log(`Property to update: ${prop}`);
    console.log(`New value: ${value}`);

    const allowedProps = ['title', 'author', 'genre', 'publisher', 'publicationYear01', 'location', 'loanStatus', 'summary'];
    if (!allowedProps.includes(prop)) {
        console.log('Invalid property');
        return res.status(400).send('Invalid property');
    }

    Book.update(isbn, prop, value, (err) => {
        if (err) {
            console.error('Error updating book:', err);
            return res.status(500).send('Error updating book');
        }
        res.status(200).send('Book updated successfully');
    });
};

