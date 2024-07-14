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
