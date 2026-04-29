import { LibraryManager } from './core/LibraryManager';
import type { Book } from './types';

const manager = new LibraryManager();

// Привязка к элементам DOM — основной экран
const nameInput = document.querySelector<HTMLInputElement>('#nameInput')!;
const authorInput = document.querySelector<HTMLInputElement>('#authorInput')!;
const addBtn = document.querySelector<HTMLButtonElement>('#addBtn')!;
const bookList = document.querySelector<HTMLUListElement>('#bookList')!;
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')!;
const uploadBtn = document.querySelector<HTMLButtonElement>('#uploadBtn')!;

// Привязка к элементам DOM — режим ридера
const readerMode = document.querySelector<HTMLElement>('#readerMode')!;
const statusBoard = document.querySelector<HTMLElement>('#statusBoard')!;
const controls = document.querySelector<HTMLElement>('.controls')!;
const readerTitle = document.querySelector<HTMLElement>('#readerTitle')!;
const readerContent = document.querySelector<HTMLElement>('#readerContent')!;
const pageInfo = document.querySelector<HTMLElement>('#pageInfo')!;
const nextPageBtn = document.querySelector<HTMLButtonElement>('#nextPageBtn')!;
const backBtn = document.querySelector<HTMLButtonElement>('#backToList')!;

// Текущая открытая книга (null если список)
let currentOpenBook: Book | null = null;

// Разбивка контента на страницы (по 50 строк на страницу)
function getPageContent(content: string, page: number): string {
  const lines = content.split('\n');
  const start = page * 50;
  const end = start + 50;
  return lines.slice(start, end).join('\n');
}

// Переключение в режим ридера
function openBook(id: string) {
  const book = manager.findBook(id);
  if (!book) return;
  
  currentOpenBook = book;
  
  statusBoard.style.display = 'none';
  controls.style.display = 'none';
  readerMode.classList.add('active');
  
  readerTitle.textContent = book.name;
  readerContent.textContent = getPageContent(book.content, book.currentPage);
  pageInfo.textContent = `Страница ${book.currentPage + 1} из ${book.totalPages}`;
}

// Закрытие ридера и возврат к списку
function closeReader() {
  currentOpenBook = null;
  readerMode.classList.remove('active');
  statusBoard.style.display = 'block';
  controls.style.display = 'flex';
  updateUI();
}

// Переход на следующую страницу
function nextPage() {
  if (!currentOpenBook) return;
  
  if (currentOpenBook.currentPage >= currentOpenBook.totalPages - 1) return;
  
  const newPage = currentOpenBook.currentPage + 1;
  manager.updateProgress(currentOpenBook.id, newPage);
  
  currentOpenBook = manager.findBook(currentOpenBook.id)!;
  readerContent.textContent = getPageContent(currentOpenBook.content, currentOpenBook.currentPage);
  pageInfo.textContent = `Страница ${currentOpenBook.currentPage + 1} из ${currentOpenBook.totalPages}`;
  
  if (currentOpenBook.status === 'finished') {
    alert('Поздравляем! Вы дочитали книгу до конца!');
    closeReader();
  }
}

// Функция обновления интерфейса (список)
function updateUI() {
  bookList.innerHTML = '';
  
  const books = manager.getAllBooks();
  
  if (books.length === 0) {
    bookList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📖</div>
        <p>Библиотека пуста. Добавьте первую книгу!</p>
      </div>
    `;
    return;
  }
  
  books.forEach(book => {
    const li = document.createElement('li');
    const summary = manager.getBookSummary(book.id);
    
    if (summary) {
      li.innerHTML = `
        <div class="book-info">
          <span class="book-title">${summary.name}</span>
          <span class="book-author">${summary.author}</span>
          <span class="status-badge" data-status="${summary.status}">${summary.status}</span>
        </div>
        <button class="read-btn" data-id="${book.id}">Читать</button>
      `;
      bookList.appendChild(li);
    }
  });

  // Делегирование событий для кнопок «Читать»
  bookList.querySelectorAll<HTMLButtonElement>('.read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openBook(btn.dataset.id!);
    });
  });
}

// Слушатель кнопки «Добавить»
addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const author = authorInput.value.trim();

  if (name && author) {
    manager.addBook({
      id: crypto.randomUUID(),
      name,
      author,
      status: 'unread',
      createdAt: new Date().toISOString(),
      content: 'Контент книги пока не загружен. Добавьте текст в поле content.',
      currentPage: 0,
      totalPages: 100
    });

    nameInput.value = '';
    authorInput.value = '';
    
    updateUI();
  } else {
    alert('Заполните все поля!');
  }
});

// Слушатели навигации ридера
nextPageBtn.addEventListener('click', nextPage);
backBtn.addEventListener('click', closeReader);

// Слушатель кнопки «Загрузить книгу»
uploadBtn.addEventListener('click', () => {
  const file = fileInput.files?.[0];
  
  if (!file) {
    alert('Выберите файл для загрузки!');
    return;
  }
  
  if (!file.name.endsWith('.txt')) {
    alert('Ошибка: поддерживаются только файлы формата .txt');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const content = e.target?.result as string;
    const name = file.name.replace('.txt', '');
    
    // Считаем страницы по количеству строк (по 50 строк на страницу)
    const lines = content.split('\n').length;
    const totalPages = Math.max(1, Math.ceil(lines / 50));
    
    manager.addBook({
      id: crypto.randomUUID(),
      name,
      author: 'Неизвестный автор',
      status: 'unread',
      createdAt: new Date().toISOString(),
      content,
      currentPage: 0,
      totalPages
    });
    
    fileInput.value = '';
    updateUI();
    alert(`Книга "${name}" успешно загружена!`);
  };
  
  reader.onerror = () => {
    alert('Ошибка при чтении файла');
  };
  
  reader.readAsText(file);
});

// Инициализация при загрузке
updateUI();
