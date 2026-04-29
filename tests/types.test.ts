import { describe, it, expectTypeOf } from 'vitest';
import { LibraryManager } from '../src/core/LibraryManager';
import type { Book } from '../src/types';
import type { ExtractArrayType } from '../src/type-utils';

describe('Type Testing (K15.1)', () => {
  
  it('ExtractArrayType should correctly unpack arrays', () => {
    // Проверка самописного условного типа
    expectTypeOf<ExtractArrayType<Book[]>>().toEqualTypeOf<Book>();
    expectTypeOf<ExtractArrayType<string>>().toBeNever();
  });

  it('LibraryManager methods should have correct signatures', () => {
    const manager = new LibraryManager();

    // Проверка возвращаемого значения getAllBooks
    expectTypeOf(manager.getAllBooks()).items.toMatchTypeOf<Book>();

    // Проверка, что getBookSummary возвращает именно Pick (только 3 поля)
    const summary = manager.getBookSummary('any-id');
    expectTypeOf(summary).toMatchTypeOf<{ name: string; author: string; status: string } | null>();
  });

  it('Static type validation with @ts-expect-error', () => {
    const manager = new LibraryManager();

    // @ts-expect-error - Метод addBook не должен принимать пустой объект
    manager.addBook({}); 

    // @ts-expect-error - updateBook не должен позволять менять id (проверка Omit)
    manager.updateBook('1', { id: 'new-id' });
  });
});