const db = require('../config/database');

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static create(user, callback) {
        const { id, name, email } = user;
        const sql = 'INSERT INTO users (id, name, email) VALUES (?, ?, ?)';
        db.run(sql, [name, email], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.lastID });
        });
    }

    static findAll(callback) {
        const sql = 'SELECT * FROM users';
        db.all(sql, [], (err, rows) => {
            if (err) {
                return callback(err);
            }
            callback(null, rows);
        });
    }
    // Método para actualizar el nombre del user
    static updateName(id, name, callback) {
        const sql = 'UPDATE users SET name = ? WHERE id = ?';
        db.run(sql, [name, id], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { changes: this.changes });
        });
    }

    // Método para actualizar el correo del user
    static updateEmail(id, email, callback) {
        const sql = 'UPDATE users SET email = ? WHERE id = ?';
        db.run(sql, [email, id], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { changes: this.changes });
        });
    }
    static delete(isbn, callback) {
        const sql = 'DELETE FROM users WHERE isbn = ?';
        db.run(sql, [isbn], function(err) {
            if (err) {
                return callback(err);
            }  
            callback(null);
        });
    }
    static deleteAll(callback) {
        const sql = 'DELETE FROM users';
        db.run(sql, [], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }

    // Otros métodos para actualizar, eliminar por id, etc.
}

module.exports = User;
