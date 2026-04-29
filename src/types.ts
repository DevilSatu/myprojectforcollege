// Основные типы и интерфейсы проекта

export interface Book {
  id: string;              // UUID или порядковый номер
  name: string;            // Название для отображения в списке
  author: string;          
  status: 'unread' | 'reading' | 'finished'; // Текущий прогресс
  createdAt: string;       // ISO дата добавления
  
  // Данные для ридера
  content: string;         // Текстовый массив данных
  currentPage: number;     
  totalPages: number;      
  genre?: string;          
  priority?: 'low' | 'medium' | 'high'; 
}

// Шаблон для формы добавления новой книги
export type NewBook = Omit<Book, 'id' | 'createdAt' | 'status' | 'currentPage'>;

// Глобальные показатели пользователя
export interface ReaderStats {
  totalBooks: number;
  booksFinished: number;
  favoriteGenre?: string;
}

// Данные активного сеанса
export type ActiveSession = {
  bookId: string;
  startTime: Date;
  sessionNotes?: string;
};

// Структура хранения в стейте (поиск по ID)
export type BookCollection = Record<string, Book>;