import { Library } from './Library.js';
import { User } from './User.js';
import { Book } from './Book.js';
import { BookCopy } from './BookCopy.js';

let listUsers = [];
let listBooks = [];
const library = new Library(9981656156, "Lectulandia");

// Función para cargar libros en la biblioteca
function sendNewBook (newBook) {
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
        listBooks = books;
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
        listUsers = users;
        return listUsers;
    } catch (error) {
        console.error('Error al cargar datos de usuarios:', error);
        throw error;
    }
}

// Función para cargar libros en la biblioteca
function loadBooks(books) {
    books.forEach(bookData => {
        // Verifica que copies esté definido y sea un array antes de intentar mapearlo
        const copies = (bookData.copies && Array.isArray(bookData.copies)) ? bookData.copies.map(copy => {
            return new BookCopy(copy.id, copy.status, copy.location, copy.borrower);
        }) : [];

        // Crea una instancia de Book con las copias de libros mapeadas
        const book = new Book(
            bookData.isbn,
            bookData.title,
            bookData.author,
            bookData.genre,
            bookData.publisher,
            bookData.publicationYear,
            bookData.location,
            bookData.summary,
            copies  // Asigna el array de instancias de BookCopy
        );

        return library.addBook(book); // Agrega el libro a la biblioteca
    });
}


// Función para cargar usuarios en la biblioteca
function loadUsers(users) {
    users.forEach(userData => {
        // Verifica si borrowedCopies está definido y es un array
        if (userData.borrowedCopies && Array.isArray(userData.borrowedCopies)) {
            // Mapea las copias prestadas y crea objetos simples con los datos
            const borrowedCopies = userData.borrowedCopies.map(copy => {
                return { 
                    copyId: copy.copyId,
                    book: copy.book,
                    loanStatus: copy.loanStatus,
                    borrower: userData.name  // Asignamos el nombre del usuario como el prestatario
                };
            });

            const user = new User(userData.id, userData.name, userData.email);
            user.borrowedCopies = borrowedCopies;
            library.addUser(user); // Agrega el usuario a la biblioteca
        } else {
            // Si borrowedCopies no está definido o no es un array
            console.warn(`El usuario con ID ${userData.id} no tiene copias prestadas o el formato es incorrecto.`);
        }
    });
}


// Función para renderizar la lista de libros
function renderBooks(filtro = '') {
    const lista = document.getElementById('book-list');
    lista.innerHTML = ''; // Limpia la lista existente

    listBooks
        .filter(book => {
            if (book.title) {
                return book.title.toLowerCase().includes(filtro.toLowerCase());
            } else {
                console.warn('Título del libro no definido:', book);
                return false;
            }
        })
        .forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.title} - ${book.author}`;
            lista.appendChild(li);
        });
}


// Función para renderizar la lista de usuarios
function renderUsers(filtro = '') {
    const lista = document.getElementById('user-list');
    lista.innerHTML = ''; // Limpia la lista existente
    
    listUsers
        .filter(user => user.name.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.email}`;
            lista.appendChild(li);
        });
}


document.addEventListener('DOMContentLoaded', () => {
    // Evento para añadir un nuevo usuario
    document.getElementById('add-user').addEventListener('click', () => {
        const id = document.getElementById('input-id').value;
        const name = document.getElementById('input-name').value;
        const email = document.getElementById('input-email').value;

        if (id && name && email) {
            const newUser = new User(id, name, email);
            const user = {id: id, name: name, email: email};
            library.addUser(newUser);
            listUsers.push(user);

            
            console.log("Datos prueba:", library.users);
            sendNewUser(newUser);
            
        }
        
    });
    // add new book
    const addButton = document.getElementById('add-book');
    //sin el if me genera un error
    if (addButton) {
        addButton.addEventListener('click', () => {
            const isbn = document.getElementById('input-isbn').value;
            const title = document.getElementById('input-title').value;
            const author = document.getElementById('input-author').value;
            const genre = document.getElementById('input-genre').value;
            const publisher = document.getElementById('input-publisher').value;
            const publicationYear = document.getElementById('input-publicationYear').value;
            const location = document.getElementById('input-location').value;
            const summary = document.getElementById('input-summary').value;

            // Verificar que todos los campos obligatorios estén completos
            if (isbn && title && author && publisher && publicationYear) {
                const newBook = new Book(isbn, title, author, genre, publisher, publicationYear, location, summary);
                library.addBook(newBook);
                listBooks.push(newBook);
                console.log("Datos de prueba:", library.books);
                renderBooks();
                sendNewBook(newBook);
            } else {
                console.error('Por favor, completa todos los campos obligatorios.');
            }
        });
    } else {
        console.error('El botón "add-book" no fue encontrado en el DOM.');
    }
});


// Evento para añadir un nuevo libro
// Filtrar usuarios por nombre
document.getElementById('input-search-user').addEventListener('input', (event) => {
    renderUsers(event.target.value);
    
});
document.getElementById('input-search-book').addEventListener('input', (event) => {
    renderBooks(event.target.value);
    
});
// Cargar datos iniciales cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    getUsers()
        .then((users) => loadUsers(users))
        .then(() => renderUsers());

    getBooks()
        .then((books) => loadBooks(books))
        .then(() => renderBooks());

    console.log("Datos cargados:", library.books, library.users);


});