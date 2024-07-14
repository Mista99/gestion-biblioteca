export class Book {
    constructor(isbn, title, author, genre = "any", publisher, publicationYear = Date, location ="any", summary="", copies = []) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.publisher = publisher;
        this.publicationYear = publicationYear;
        this.location = location;
        this.summary = summary;
        this.copies = copies; // Array to hold individual copies
        this.loanStatus = "available";
    }

    addCopy() {
        // Method to add a new copy of the book
        const copy = new BookCopy(this);
        this.copies.push(copy);
    }

    getAvailableCopies() {
        // Method to get available copies of the book
        return this.copies.filter(copy => copy.loanStatus === 'available');
    }
}