const db = require('../config/database');

class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static create(user, callback) {
        const { name, email } = user;
        const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
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
