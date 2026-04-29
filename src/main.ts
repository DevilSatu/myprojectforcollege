import { LibraryManager } from './core/LibraryManager';

const manager = new LibraryManager();

// Привязка к элементам DOM
const nameInput = document.querySelector<HTMLInputElement>('#nameInput')!;
const authorInput = document.querySelector<HTMLInputElement>('#authorInput')!;
const addBtn = document.querySelector<HTMLButtonElement>('#addBtn')!;
const bookList = document.querySelector<HTMLUListElement>('#bookList')!;

// Функция обновления интерфейса
function updateUI() {
  bookList.innerHTML = ''; // Очистка списка
  
  manager.getAllBooks().forEach(book => {
    const li = document.createElement('li');
    
    // Используем Pick-логику из твоего ядра
    const summary = manager.getBookSummary(book.id);
    
    if (summary) {
      li.innerHTML = `
        <span><strong>${summary.name}</strong> — ${summary.author}</span>
        <small>${summary.status}</small>
      `;
      bookList.appendChild(li);
    }
  });
}

// Слушатель клика на кнопку
addBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const author = authorInput.value.trim();

  if (name && author) {
    manager.addBook({
      id: crypto.randomUUID(), // Генерация уникального ID
      name,
      author,
      status: 'unread',
      createdAt: new Date().toISOString(),
      content: 'No content yet',
      currentPage: 0,
      totalPages: 100
    });

    // Сброс полей
    nameInput.value = '';
    authorInput.value = '';
    
    updateUI();
  } else {
    alert('Заполните все поля!');
  }
});