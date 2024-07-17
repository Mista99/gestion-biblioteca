const sqlite3 = require('sqlite3').verbose(); //verbose)= -> version extendida de Sqlite con mensajes en la consola para mejroar la depuracion
const path = require('path'); //para manejar rutas de archivos de manera mas eficiente

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS Books (
            isbn TEXT PRIMARY KEY,
            title TEXT,
            author TEXT,
            genre TEXT,
            publisher TEXT,
            publicationYear INTEGER,
            location TEXT,
            loanStatus TEXT,
            summary TEXT
          )`);
    }
});

module.exports = db;
