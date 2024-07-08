export class BookCopy {
    constructor(copyId, book) {
        this.copyId = copyId;
        this.book = book;
        this.loanStatus = 'available';
        this.borrower = null;
    }

    loan(user) {
        if (this.loanStatus === 'available') {
            this.loanStatus = 'loaned';
            this.borrower = user;
            return true;
        }
        return false;
    }

    returnBook() {
        if (this.loanStatus === 'loaned') {
            this.loanStatus = 'available';
            this.borrower  = null;
            return true;
        }
        return false;
    }
}