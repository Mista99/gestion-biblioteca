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
        return books;
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
        return users;
    } catch (error) {
        console.error('Error al cargar datos de usuarios:', error);
        throw error;
    }
}

// Función para cargar libros en la biblioteca
function loadBooks(books) {
    const booksToAdd = books.map(bookData => {
        const copies = bookData.copies.map(copy => {
            return new BookCopy(copy.id, copy.status, copy.location, copy.borrower);
        });

        const book = new Book(
            bookData.isbn,
            bookData.title,
            bookData.author,
            bookData.genre,
            bookData.publisher,
            bookData.publicationYear,
            bookData.location,
            bookData.summary,
            copies
        );

        library.addBook(book); // Agrega el libro a la biblioteca
        return book;
    });

    return Promise.all(booksToAdd); // Devuelve una promesa que resuelve con los libros agregados
}

// Función para cargar usuarios en la biblioteca
function loadUsers(users) {
    const usersToAdd = users.map(userData => {
        const borrowedCopies = userData.borrowedCopies.map(copy => {
            return { 
                copyId: copy.copyId,
                book: copy.book,
                loanStatus: copy.loanStatus,
                borrower: userData.name
            };
        });

        const user = new User(userData.id, userData.name, userData.email);
        user.borrowedCopies = borrowedCopies;
        library.addUser(user); // Agrega el usuario a la biblioteca
        return user;
    });

    return Promise.all(usersToAdd); // Devuelve una promesa que resuelve con los usuarios agregados
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
        library.addUser(newUser);
        listUsers.push(newUser); 
        loadUsers(listUsers);
        renderUsers();
    }
});

// Cargar datos iniciales cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    getUsers()
        .then(users => loadUsers(users))
        .then(() => renderUsers());

    getBooks()
        .then(books => loadBooks(books))
        .then(() => renderBooks());

    console.log("Datos cargados:", library.books, library.users);
});