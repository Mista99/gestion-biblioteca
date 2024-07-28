import { listUsers, listBooks } from './config.js';
export { sendNewBook, sendNewUser, getBooks, getUsers, deleteBook, deleteUser, updateUserName, updateUserEmail, updateBookProp, registerUser, loginUser};

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
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();  // Asegurarse de que estás manejando JSON
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
async function registerUser(userData) {
    const url = 'http://localhost:3000/api/register'; // Cambia esto por la URL de tu API

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('User registered successfully:', data);
        return data;
    } catch (error) {
        console.error('Error registering user:', error.message);
        throw new Error(`Error registering user: ${error.message}`);
    }
}

async function loginUser(userData) {
    const url = 'http://localhost:3000/login'; // Cambia esto por la URL de tu API

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('User logged in successfully:', data);
        return data;
    } catch (error) {
        console.error('Error logging in user:', error.message);
        throw new Error(`Error logging in user: ${error.message}`);
    }
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
        const response = await fetch(`http://localhost:3000/api/users/${id}/name`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user name:', error);
        throw error;
    }
}

async function updateBookProp(isbn, prop, value) {
    try {
        const response = await fetch(`http://localhost:3000/api/books/${isbn}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prop, value })
        });

        if (!response.ok) {
            throw new Error('Failed to update book property');
        }

        // Verifica si la respuesta tiene un contenido JSON
        const result = await response.json();
        console.log('Update response:', result);
        return result;
    } catch (error) {
        console.error('Error updating book property:', error);
        throw error;
    }
}

async function updateUserEmail(id, email) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}/email`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

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
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Leer el mensaje de error del servidor
            throw new Error(`Error al eliminar el usuario del servidor: ${errorMessage}`);
        }

        // Eliminar el usuario de listUsers
        const userIndex = listUsers.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            listUsers.splice(userIndex, 1);
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}


