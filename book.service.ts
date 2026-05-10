import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  private storageKey = 'books';

  getBooks() {

    return JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );

  }

  saveBooks(books: any[]) {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(books)
    );

  }

  addBook(book: any) {

    const books = this.getBooks();

    books.push(book);

    this.saveBooks(books);

  }

  deleteBook(index: number) {

    const books = this.getBooks();

    books.splice(index, 1);

    this.saveBooks(books);

  }

}