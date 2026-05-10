import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BorrowService {

  private storageKey = 'borrowedBooks';

  getBorrowedBooks() {

    return JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );

  }

  saveBorrowedBooks(books: any[]) {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(books)
    );

  }

  borrowBook(book: any) {

    const books = this.getBorrowedBooks();

    books.push(book);

    this.saveBorrowedBooks(books);

  }

  returnBook(index: number) {

    const books = this.getBorrowedBooks();

    books.splice(index, 1);

    this.saveBorrowedBooks(books);

  }

}