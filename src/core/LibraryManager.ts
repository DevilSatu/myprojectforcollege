import type { Book, BookCollection } from '../types';

// Ключ для localStorage
const STORAGE_KEY = 'library_books';

export class LibraryManager {
  private books: BookCollection = {};

  constructor() {
    // Загрузка данных при создании экземпляра
    this.loadFromStorage();
  }

  // Сохранение всей коллекции в localStorage
  private syncToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.books));
    }
  }

  // Загрузка из localStorage в память
  private loadFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.books = JSON.parse(data);
      }
    }
  }

  // Делаем новую книжку и сохраняем её в коллекции
  addBook(book: Book): void {
    this.books[book.id] = book;
    this.syncToStorage();
  }

  // Обновление метаданных (исключая id и дату создания)
  updateBook(id: string, updates: Partial<Omit<Book, 'id' | 'createdAt'>>): void {
    const current = this.books[id];
    if (current) {
      this.books[id] = { ...current, ...updates };
      this.syncToStorage();
    }
  }

  // Обновление прогресса чтения с авто-сменой статуса
  updateProgress(id: string, page: number): void {
    const book = this.books[id];
    if (book) {
      book.currentPage = page;
      
      // Авто-смена статуса при достижении последней страницы (0-индексация)
      if (page >= book.totalPages - 1) {
        book.status = 'finished';
      } else if (book.status === 'unread') {
        book.status = 'reading';
      }
      
      this.syncToStorage();
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