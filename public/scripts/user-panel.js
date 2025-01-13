document.addEventListener('DOMContentLoaded', function() {
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

    const loansTab = document.getElementById('loans-tab');
    const booksTab = document.getElementById('books-tab');
    const userLoansContainer = document.getElementById('user-loans');
    const libraryBooksContainer = document.getElementById('library-books');
    const searchInput = document.getElementById('search-input');

    let allBooks = [];

    // Función para formatear fechas
    function formatDate(dateString) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Función para renderizar libros
    function renderBooks(books) {
        libraryBooksContainer.innerHTML = '';
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <h5>${book.isbn}</h5>
                <h5>${book.title}</h5>
                <p>Autor: ${book.author}</p>
                <p>Copias disponibles: ${book.availableCopies}</p>

            `;
            libraryBooksContainer.appendChild(bookElement);
        });
    }

    // Función para cargar préstamos
    function loadLoans() {
        fetch('/api/user-loans')
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.borrowedBooks) && data.borrowedBooks.length > 0) {
                    userLoansContainer.innerHTML = ''; // Limpiar el contenedor
                    data.borrowedBooks.forEach(loan => {
                        const loanElement = document.createElement('div');
                        loanElement.classList.add('loan');
                        loanElement.innerHTML = `
                            <h5>${loan.bookId}</h5>
                            <h5>${loan.title}</h5>
                            <p>Fecha de préstamo: ${formatDate(loan.borrowedDate)}</p>
                            <p>Fecha de vencimiento: ${formatDate(loan.returnDate)}</p>
                            <button class="btn btn-primary extend-loan" data-loan-id="${loan.bookId}" data-user-id="">Ampliar Plazo</button>
                        `;
                        userLoansContainer.appendChild(loanElement);
                    });
    
                    // Añadir eventos a los botones de ampliar plazo
                    const extendButtons = document.querySelectorAll('.extend-loan');
                    extendButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            const loanId = this.getAttribute('data-loan-id');
                            extendLoan(loanId);
                        });
                    });
                } else {
                    // Si no hay préstamos o el array está vacío
                    userLoansContainer.innerHTML = '<h5>No tiene préstamos actualmente</h5>';
                }
            })
            .catch(error => console.error('Error fetching user loans:', error));
    }
    

    // Evento para ver préstamos
    loansTab.addEventListener('click', function(event) {
        event.preventDefault();
        loadLoans();
        loansTab.classList.add('active');
        loansTab.classList.add('bg-dark');
        booksTab.classList.remove('active');
        booksTab.classList.remove('bg-dark');
        userLoansContainer.parentElement.classList.add('show', 'active');
        libraryBooksContainer.parentElement.classList.remove('show', 'active');
    });

    // Evento para ver libros disponibles
    booksTab.addEventListener('click', function(event) {
        event.preventDefault();
        fetch('/api/library-books')
            .then(response => response.json())
            .then(data => {
                allBooks = data.books;
                renderBooks(allBooks);

                booksTab.classList.add('active');
                booksTab.classList.add('bg-dark');
                loansTab.classList.remove('active');
                loansTab.classList.remove('bg-dark');

                libraryBooksContainer.parentElement.classList.add('show', 'active');
                userLoansContainer.parentElement.classList.remove('show', 'active');
            })
            .catch(error => console.error('Error fetching library books:', error));
    });

    // Evento para buscar libros
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        const filteredBooks = allBooks.filter(book =>
            book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
        );
        renderBooks(filteredBooks);
    });
    // Función para mostrar mensajes
    function showMessage(type, message) {
        const messageElement = document.getElementById(`${type}-message`);
        const messageDiv = messageElement.querySelector('.alert-message'); // Selecciona el div con clase alert-message

        if (!messageElement || !messageDiv) {
            console.error(`Element not found for type: ${type}`);
            return;
        }

        messageDiv.textContent = message;

        // Asegúrate de que el mensaje está visible
        messageElement.style.display = 'flex';
        messageElement.classList.remove('fade', 'show');
        // Forzar reflujo para reiniciar la animación
        void messageElement.offsetWidth;
        messageElement.classList.add('fade', 'show');

        // Ocultar el mensaje después de 5 segundos, si no se ha cerrado manualmente
        const timeoutId = setTimeout(() => {
            hideMessage(`${type}-message`);
        }, 5000);

        // Añadir un listener para el botón de cerrar que detiene el temporizador
        const closeButton = messageElement.querySelector('.btn-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(timeoutId);
            hideMessage(`${type}-message`);
        });
    }

    // Función para ocultar el mensaje
    function hideMessage(id) {
        const messageElement = document.getElementById(id);
        if (messageElement) {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 150); // Tiempo de espera para la animación de desvanecimiento
        }
    }

    // Función para ampliar el plazo del préstamo
    function extendLoan(loanId, userId) {
        fetch(`/api/extend-loan/${loanId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        })
        .then(response => {
            if (response.ok) {
                showMessage('success', 'Plazo de préstamo ampliado exitosamente');
                loadLoans(); // Recargar los préstamos
            } else {
                return response.json().then(data => {
                    showMessage('error', data.error || 'Error al ampliar el plazo de préstamo');
                });
            }
        })
        .catch(error => {
            console.error('Error extending loan:', error);
            showMessage('error', `Error: ${error.message}`);
        });
    }
    
    // Trigger click event on loans tab to load the loans by default
    loansTab.click();
});
