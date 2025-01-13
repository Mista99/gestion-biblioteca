import { Library } from './Library.js';
import { User } from './User.js';
import { Book } from './Book.js';
import { BookCopy } from './BookCopy.js';
import {createEditIcon, createTrashIcon} from './buttons.js';
import {listUsers, listBooks} from './config.js'
import {sendNewBook, sendNewUser, getBooks, getUsers, deleteBook, deleteUser, updateUserName, updateUserEmail, updateBookProp} from './apiServices.js';

const library = new Library(9981656156, "Lectulandia");

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

            const uss = new User(userData.id, userData.name, userData.email);
            uss.borrowedCopies = borrowedCopies;
            return library.addUser(uss); // Agrega el usuario a la biblioteca
        } else {
            // Si borrowedCopies no está definido o no es un array
            console.warn(`El usuario con ID ${userData.id} no tiene copias prestadas o el formato es incorrecto.`);
        }
    });
}

function renderBooks(filtro = '') {
    const lista = document.getElementById('book-list');
    lista.innerHTML = ''; // Limpia la lista existente
    
    listBooks.filter(book => book.title.toLowerCase().includes(filtro.toLowerCase())).forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} - ${book.author}`;
        li.classList.add('book-item'); // Añadir la clase 'book-item' al elemento li
        li.id = `book-${book.isbn}`; // Añadir un id único basado en el ISBN del libro
        li.addEventListener('click', () => toggleBookDetails(book, li)); // Agregar evento click

        // Crear el contenedor del ícono de eliminación
        const iconContainer = document.createElement('span');
        iconContainer.classList.add('trash-icon-container');
        const trashIcon = createTrashIcon();
        iconContainer.appendChild(trashIcon);
        
        // Añadir el ícono de eliminación al li
        li.appendChild(iconContainer);

        lista.appendChild(li);
        //evendo eliminar
        trashIcon.addEventListener('click', async (e) => {
            console.log(book.isbn)
            // e.stopPropagation(); // Evita que el evento se propague al li
            await deleteBook(book.isbn);
            getBooks();
            renderBooks();
        });
    });
}

function toggleBookDetails(book, clickedLi) {
    const detailsId = `details-${book.isbn}`;
    const existingDetails = document.getElementById(detailsId);

    if (existingDetails) {
        // Si los detalles ya están visibles, los ocultamos
        existingDetails.remove();
    } else {
        // Si los detalles no están visibles, los mostramos
        const detailsContainer = createBookDetails(book);
        detailsContainer.id = detailsId;
        clickedLi.insertAdjacentElement('afterend', detailsContainer);
    }
}

function createBookDetails(book) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('book-details-container');

    const detailsList = document.createElement('ul');

    // Iterar sobre las propiedades del libro y agregarlas como elementos de lista
    for (const [key, value] of Object.entries(book)) {
        const listItem = document.createElement('li');
        listItem.classList.add('details-item');
        listItem.textContent = `${key}: ${value}`;
        detailsList.appendChild(listItem);
        if (key != "isbn") {
            // Crear el contenedor del ícono de editar
            const iconContainer = document.createElement('span');
            iconContainer.classList.add('edit-icon-container');
            const editIcon = createEditIcon();
            iconContainer.appendChild(editIcon);
            // Añadir el ícono de editar al li
            listItem.appendChild(iconContainer);
            editIcon.addEventListener('click', () => {
                toggleBookEdit(book, listItem, key);
            });
        }
    }

    detailsContainer.appendChild(detailsList);
    return detailsContainer;
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
            li.classList.add('user-item'); // Añadir la clase 'book-item' al elemento li
            li.id = `user-${user.id}`; // Añadir un id único basado en el ISBN del libro
            
            li.addEventListener('click', () => toggleUserDetails(user, li)); // Agregar evento click

            // Crear el contenedor del ícono de eliminación
            const iconContainer = document.createElement('span');
            iconContainer.classList.add('trash-icon-container');
            const trashIcon = createTrashIcon();
            iconContainer.appendChild(trashIcon);
            
            // Añadir el ícono de eliminación al li
            li.appendChild(iconContainer);
            lista.appendChild(li);
            //evento eliminar
            trashIcon.addEventListener('click', async (e) => {
                // e.stopPropagation(); // Evita que el evento se propague al li
                await deleteUser(user.id);
                getUsers();
                renderUsers();
            });
        });
}

function toggleUserDetails(user, clickedLi) {
    const detailsId = `details-${user.id}`;
    const existingDetails = document.getElementById(detailsId);

    if (existingDetails) {
        // Si los detalles ya están visibles, los ocultamos
        existingDetails.remove();
    } else {
        // Si los detalles no están visibles, los mostramos
        const detailsContainer = createUserDetails(user);
        detailsContainer.id = detailsId;
        clickedLi.insertAdjacentElement('afterend', detailsContainer);
    }
}
function toggleUserEdit(user, li, key) {
    // Si ya está en modo edición, lo desactivamos
    if (li.classList.contains('editing')) {
        li.classList.remove('editing');
        li.innerHTML = `${user[key]}`;

        // Restaurar el ícono de edición
        const iconContainer = document.createElement('span');
        iconContainer.classList.add('edit-icon-container');
        const editIcon = createEditIcon();
        iconContainer.appendChild(editIcon);
        li.appendChild(iconContainer);
        
    } else {
        // Cambiar a modo edición
        li.classList.add('editing');
        li.innerHTML = `
            <input type="text" id="edit-${user[key]}" value="${user[key]}">
        `;

        // Añadir el botón de guardar
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';
        saveButton.addEventListener('click', () => {
            const updateLi = document.getElementById(`edit-${user[key]}`).value;

            // Actualizar los datos del usuario
            user[key] = updateLi;
            if (key = "name"){
                updateUserName(user.id, user.name);
            }
            if (key = "email") {
                updateUserEmail(user.id, user.email);
            }
            
            // Actualizar la visualización y volver al modo de vista
            renderUsers();
        });
        li.appendChild(saveButton);

        // Restaurar el ícono de edición
        const iconContainer = document.createElement('span');
        iconContainer.classList.add('edit-icon-container');
        const editIcon = createEditIcon();
        iconContainer.appendChild(editIcon);
        li.appendChild(iconContainer);
        
    }
}
function toggleBookEdit(book, li, key) {
    // Si ya está en modo edición, lo desactivamos
    if (li.classList.contains('editing')) {
        li.classList.remove('editing');
        li.innerHTML = `${book[key]}`;

        // Restaurar el ícono de edición
        const iconContainer = document.createElement('span');
        iconContainer.classList.add('edit-icon-container');
        const editIcon = createEditIcon();
        iconContainer.appendChild(editIcon);
        li.appendChild(iconContainer);
        
    } else {
        // Cambiar a modo edición
        li.classList.add('editing');
        li.innerHTML = `
            <input type="text" id="edit-${book[key]}" value="${book[key]}">
        `;

        // Añadir el botón de guardar
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';
        saveButton.addEventListener('click', () => {
            const updateLi = document.getElementById(`edit-${book[key]}`).value;

            // Actualizar los datos del libro
            book[key] = updateLi;
            updateBookProp(book.isbn, key, book[key]);
            // Actualizar la visualización y volver al modo de vista
            renderBooks();
        });
        li.appendChild(saveButton);

        // Restaurar el ícono de edición
        const iconContainer = document.createElement('span');
        iconContainer.classList.add('edit-icon-container');
        const editIcon = createEditIcon();
        iconContainer.appendChild(editIcon);
        li.appendChild(iconContainer);
        
    }
}
function createUserDetails(user) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('user-details-container');
    const detailsList = document.createElement('ul');

    // Iterar sobre las propiedades del user y agregarlas como elementos de lista
    for (const [key, value] of Object.entries(user)) {//Object.entries convierte en arrays clave valor a los atributos y valores de user
        console.log(`prueba de key: ${user[key]}`);
        const listItem = document.createElement('li');
        listItem.classList.add('details-item');
        listItem.textContent = `${key}: ${value}`;
        detailsList.appendChild(listItem);

        if (key != "id") {
            // Crear el contenedor del ícono de editar
            const iconContainer = document.createElement('span');
            iconContainer.classList.add('edit-icon-container');
            const editIcon = createEditIcon();
            iconContainer.appendChild(editIcon);
            // Evento para el ícono de edición
            editIcon.addEventListener('click', () => {
                toggleUserEdit(user, listItem, key);
            });
            // Añadir el ícono de editar al li
            listItem.appendChild(iconContainer);
        }
    }
    
    detailsContainer.appendChild(detailsList);
    return detailsContainer;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('log-out').addEventListener('click', function(event) {
        event.preventDefault();
        
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }).then(response => {
            if (response.ok) {
                window.location.href = './api/login'; // Redirige a la página de inicio de sesión
            } else {
                console.error('Error al cerrar sesión');
            }
        }).catch(error => {
            console.error('Error al cerrar sesión', error);
        });
    });
    // Evento para añadir un nuevo usuario
    document.getElementById('add-user').addEventListener('click', () => {
        const id = document.getElementById('input-id').value;
        const name = document.getElementById('input-name').value;
        const email = document.getElementById('input-email').value;
        const role = document.getElementById('input-role').value;

        if (id && name && email) {
            const newUser = new User(id, name, email, role);
            const user = {id: id, name: name, email: email, role: role};
            library.addUser(user);
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
                sendNewBook(newBook);
                renderBooks();
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
        .then((users) => loadUsers(users)) //cargar usuarios como objetos, auqneu no funciona
        .then(() => renderUsers());

    getBooks()
        .then((books) => loadBooks(books))
        .then(() => renderBooks());

    console.log("Datos cargados:", library.users, library.books);

});