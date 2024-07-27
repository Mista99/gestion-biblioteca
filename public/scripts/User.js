export class User {
    constructor(id, name, email, role = "user", borrowedCopies = []) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.borrowedCopies = borrowedCopies;

    }

    borrowBook(copy) {
        this.borrowedCopies.push(copy);
    }

    returnBook(copy) {
        this.borrowedCopies = this.borrowedCopies.filter(c => c !== copy);
    }

    getBorrowedCopies(book) {
        return this.borrowedCopies.filter(copy => copy.book === book);
    }
}