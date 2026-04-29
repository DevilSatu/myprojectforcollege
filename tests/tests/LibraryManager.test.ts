import { describe, it, expect, beforeEach } from 'vitest';
import { LibraryManager } from '../../src/core/LibraryManager';

describe('LibraryManager unit tests', () => {
  let manager: LibraryManager;

  beforeEach(() => {
    manager = new LibraryManager();
  });

  it('create and find book by id', () => {
    const id = 'book-101';
    manager.addBook({
      id,
      name: 'Typescript Patterns',
      author: 'Refactoring Guru',
      status: 'unread',
      createdAt: new Date().toISOString(),
      content: '...',
      currentPage: 0,
      totalPages: 100
    });

    const book = manager.findBook(id);
    expect(book).toBeDefined();
    expect(book?.name).toBe('Typescript Patterns');
  });

  it('check Pick utility (metadata only)', () => {
    manager.addBook({
      id: 'book-202',
      name: 'Clean Architecture',
      author: 'Robert Martin',
      status: 'reading',
      createdAt: new Date().toISOString(),
      content: 'Long text content...',
      currentPage: 20,
      totalPages: 400
    });

    const summary = manager.getBookSummary('book-202');
    expect(summary).toHaveProperty('name');
    expect(summary).not.toHaveProperty('content'); // Контент должен быть отсечен
  });
});