import { listUsers, listBooks } from './config.js';
export { sendNewBook, sendNewUser, getBooks, getUsers, deleteBook, deleteUser, updateUserName, updateUserEmail };

// Función para cargar libros en la biblioteca
function sendNewBook(newBook) {
    fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBook)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud POST para Books');
        }
        return response.text();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function sendNewUser(newUser) {
    fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud POST para Users');
        }
        return response.text();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function getBooks() {
    try {
        const responseBooks = await fetch('http://localhost:3000/api/books');
        const books = await responseBooks.json();
        listBooks.length = 0; // Limpia el array actual
        listBooks.push(...books); // Añade los nuevos datos
        return listBooks;
    } catch (error) {
        console.error('Error al cargar datos de libros:', error);
        throw error;
    }
}

// Función para cargar usuarios en la biblioteca
async function getUsers() {
    try {
        const responseUsers = await fetch('http://localhost:3000/api/users');
        const users = await responseUsers.json();
        listUsers.length = 0; // Limpia el array actual
        listUsers.push(...users); // Añade los nuevos datos
        return listUsers;
    } catch (error) {
        console.error('Error al cargar datos de usuarios:', error);
        throw error;
    }
}
async function updateUserName(id, name) {
    try {
        const response = await fetch('http://localhost:3000/api/users/name', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user name:', error);
        throw error;
    }
}
async function updateUserEmail(id, email) {
    try {
        const response = await fetch('http://localhost:3000/api/users/email', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, email })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user email:', error);
        throw error;
    }
}

async function deleteBook(isbn) {
    try {
        const response = await fetch(`http://localhost:3000/api/books/${isbn}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el libro del servidor');
        }

        // Eliminar el libro de listBooks
        const bookIndex = listBooks.findIndex(book => book.isbn === isbn);
        if (bookIndex !== -1) {
            listBooks.splice(bookIndex, 1);
        }
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
}
async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el usuario del servidor');
        }

        // Eliminar el libro de listBooks
        const userIndex = listUsers.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            listUsers.splice(userIndex, 1);
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}

