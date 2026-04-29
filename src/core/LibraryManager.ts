import type { Book, BookCollection } from '../types';

export class LibraryManager {
  private books: BookCollection = {};

  addBook(book: Book): void {
    this.books[book.id] = book;
  }

  // 1. Partial + Omit для безопасного обновления
  updateBook(id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): void {
    const currentBook = this.books[id];
    if (currentBook) {
      this.books[id] = { ...currentBook, ...updates };
    }
  }

  // 2. Pick для краткой сводки (без тяжелого контента)
  getBookSummary(id: string): Pick<Book, 'name' | 'author' | 'status'> | null {
    const book = this.books[id];
    if (!book) return null;

    return {
      name: book.name,
      author: book.author,
      status: book.status
    };
  }

  findBook(id: string): Book | undefined {
    return this.books[id];
  }

  getAllBooks(): Book[] {
    return Object.values(this.books);
  }
}