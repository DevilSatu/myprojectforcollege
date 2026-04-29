import type { Book, BookCollection } from '../types';

export class LibraryManager {
  private books: BookCollection = {};

  // Делаем новую книжку и сохраняем её в коллекции
  addBook(book: Book): void {
    this.books[book.id] = book;
  }

  // Обновление метаданных (исключая id и дату создания), надеюсь, б***ть на этот раз заработает
  updateBook(id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): void {
    const current = this.books[id];
    if (current) {
      this.books[id] = { ...current, ...updates };
    }
  }

  
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