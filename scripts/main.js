import { Library } from './Library.js';
import { User } from './User.js';
import { Book } from './Book.js';
import { BookCopy } from './BookCopy.js';

let listUsers = [];
let listBooks = [];
// Importar datos de libros
async function getBooks() {
    try {
        // Cargar libros
        const responseBooks = await fetch('./data/books.json');
        const books = await responseBooks.json();
        listBooks = books;
        return books;  // Devuelve los libros cargados
    } catch (error) {
        console.error('Error al cargar datos:', error);
        throw error;  // Re-lanza el error para manejarlo fuera de la función
    }
}

async function getUsers(){
    // Cargar usuarios
    try {
        const responseUsers = await fetch('./data/users.json');
        const users = await responseUsers.json();
        // Asignar los usuarios cargados a la variable global
        listUsers = users;
        return users;

    } 
    catch (error) {
        console.error('Error al cargar datos:', error);
        throw error;  // Re-lanza el error para manejarlo fuera de la función
    }

}


//Renderizar usuarios:
function renderBooks(filtro = '') {
    const lista = document.getElementById('book-list');
    lista.innerHTML = ''; // Limpiamos la lista existente
    
    listBooks
        .filter(book => book.title.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.isbn} - ${book.title} - ${book.author}`;
            lista.appendChild(li);
        });
}
function renderUsers(filtro = '') {
    const lista = document.getElementById('user-list');
    lista.innerHTML = ''; // Limpiamos la lista existente
    
    listUsers
        .filter(user => user.name.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.email}`;
            lista.appendChild(li);
        });
}
//initial data
const library = new Library(9981656156, "Lectulandia");
//Eventos
// Añadir nuevo usuario (simulado localmente)
document.getElementById('add-user').addEventListener('click', () => {
    const id = document.getElementById('id-input').value;
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;

    if (id && name && email) {
        const nuevoUsuario = User(id, name, email);
            
    }
});

 
// Cargar datos JSON a cada clase
function loadBooks(books) {
    const booksToAdd = books.map(bookData => {
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
        
        return library.addBook(book); // Devuelve el libro creado
    });

}


// Función para añadir usuarios a la biblioteca
function loadUsers(users) {
    const usersToAdd = users.map(userData => {
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
        return library.addUser(user);
    });
}


// Añadir libros y usuarios a la biblioteca
// loadBooks(listBooks);
// loadUsers(listUsers);




// Inicializar la lista de usuarios cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    getUsers().then(() => renderUsers()).then(() => loadUsers(listUsers));
    getBooks().then(() => renderBooks()).then(() => loadBooks(listBooks));
    // Mostrar la biblioteca en la consola
    console.log(`Libros añadidos a ${library.name}:`, library.books);
    console.log(`Usuarios añadidos a ${library.name}:`, library.users);
});
