import { listUsers, listBooks } from './config.js';
export { sendNewBook, sendNewUser, getBooks, getUsers, deleteBook };

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

        // Volver a renderizar la lista de libros
        renderBooks();
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
}

