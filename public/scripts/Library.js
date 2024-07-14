export class Library {
    constructor(nit, name) {
        // Check if nit is an integer and name is string
        if (typeof nit !== 'number' || !Number.isInteger(nit)) {
            throw new TypeError('NIT must be an integer.');
        }
        if (typeof name !== 'string') {
            throw new TypeError('Name must be a string.');
        }
        this.nit = nit;
        this.name = name;
        this.books = [];
        this.users = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    removeBook(book) {
        this.books = this.books.filter(b => b !== book);
    }

    addUser(user) {
        this.users.push(user);
    }

    removeUser(user) {
        this.users = this.users.filter(u => u !== user);
    }

    searchUser(query) {
        return this.users.filter(user => 
            user.name.includes(query) || 
            user.id.includes(query)
        );
    }

    searchBooks(query) {
        return this.books.filter(book => 
            book.title.includes(query) || 
            book.author.includes(query)
        );
    }

    loanBook(book, user) {
        const availableCopies = book.getAvailableCopies();
        if (availableCopies.length > 0) {
            const copy = availableCopies[0];
            copy.loan(user);
            user.borrowBook(copy);
        } else {
            console.log('No copies available.');
        }
    }

    returnBook(book, user) {
        const borrowedCopies = user.getBorrowedCopies(book);
        if (borrowedCopies.length > 0) {
            const copy = borrowedCopies[0];
            copy.returnBook();
            user.returnBook(copy);
        } else {
            console.log('This user does not have this book.');
        }
    }
}