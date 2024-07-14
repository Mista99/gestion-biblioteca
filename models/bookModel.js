const db = require('../config/database');

class Book {
    constructor(isbn, title, author, genre, publisher, publicationYear, location, loanStatus, summary) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.publisher = publisher;
        this.publicationYear = publicationYear;
        this.location = location;
        this.loanStatus = loanStatus;
        this.summary = summary;
    }

    static create(book, callback) {
        const { isbn, title, author, genre, publisher, publicationYear, location, loanStatus, summary } = book;
        const sql = `INSERT INTO Books 
                    (isbn, title, author, genre, publisher, publicationYear, location, loanStatus, summary) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [isbn, title, author, genre, publisher, publicationYear, location, loanStatus, summary], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }

    static findAll(callback) {
        const sql = 'SELECT * FROM Books';
        db.all(sql, [], (err, rows) => {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    }

    static deleteAll(callback) {
        const sql = 'DELETE FROM Books';
        db.run(sql, [], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }

    // Otros métodos para actualizar, eliminar por isbn, etc.
}

module.exports = Book;
