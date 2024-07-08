import { Library } from './Library.js';
import { User } from './User.js';
import { Book } from './Book.js';
import { BookCopy } from './BookCopy.js';

let listUsers = [];
let listBooks = [];
const library = new Library(9981656156, "Lectulandia");

// Función para cargar libros en la biblioteca
async function getBooks() {
    try {
        const responseBooks = await fetch('./data/books.json');
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
        const responseUsers = await fetch('./data/users.json');
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
        // Mapea las copias de libros y crea instancias de BookCopy para cada una
        const copies = bookData.copies.map(copy => {
            return new BookCopy(copy.id, copy.status, copy.location, copy.borrower);
        });

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
        return library.addUser(user); // Agrega el usuario a la biblioteca
    });
}

// Función para renderizar la lista de libros
function renderBooks(filtro = '') {
    const lista = document.getElementById('book-list');
    lista.innerHTML = ''; // Limpia la lista existente
    
    listBooks
        .filter(book => book.title.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.isbn} - ${book.title} - ${book.author}`;
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
        id.value = '';
        name.value = '';
        email.value = '';
        renderUsers();
    }
});

// Evento para añadir un nuevo libro
// document.getElementById('add-book').addEventListener('click', () => {

//     const isbn = document.getElementById('input-isbn').value;
//     const title = document.getElementById('input-title').value;
//     const author = document.getElementById('input-author').value;
//     const genre = document.getElementById('input-genre').value;
//     const publisher = document.getElementById('input-publisher').value;
//     const publicationYear = document.getElementById('input-publicationYear').value;
//     const location = document.getElementById('input-location').value;
//     const summary = document.getElementById('input-summary').value;

//     if (isbn && title && author && publisher && publicationYear) {
//         const newBook = new Book(isbn = isbn, title = title, author = author, genre = genre, publisher = publisher, publicationYear = publicationYear, location = location, summary = summary);
//         library.addBook(newBook);
//         listBooks.push(newBook);
        
//         console.log("Datos prueba:", library.books);
//         isbn.value = '';
//         title.value = '';
//         author.value = '';
//         genre.value = '';
//         publisher.value = '';
//         publicationYear.value = '';
//         location.value = '';
//         summary.value = '';
//         renderUsers();
//     }
// });
// Filtrar usuarios por nombre
document.getElementById('input-search-user').addEventListener('input', (event) => {
    renderUsers(event.target.value);
    
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