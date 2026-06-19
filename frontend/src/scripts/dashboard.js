import api from '../api.js';

// --- Проверка авторизации ---
if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// --- Проверка подписки ---
const subType = localStorage.getItem('subscription_type') || 'free';
const until = localStorage.getItem('subscription_until');
const isActive = until ? new Date(until) > new Date() : false;
if (subType !== 'admin' && (subType === 'free' || !isActive)) {
  window.location.href = '/pricing.html';
}

// --- Время сессии ---
const startTime = Date.now();
const sessionTimeEl = document.getElementById('sessionTime');

function updateSessionTime() {
  if (!sessionTimeEl) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  sessionTimeEl.textContent =
    `session: ${hours}h:${String(minutes).padStart(2, '0')}min:${String(seconds).padStart(2, '0')}sec`;
}
updateSessionTime();
setInterval(updateSessionTime, 1000);

// --- Кнопка выхода ---
const logoutTopBtn = document.getElementById('logoutTopBtn');
if (logoutTopBtn) {
  logoutTopBtn.addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login.html';
  });
}

// --- Данные новостей (по умолчанию 4 новости) ---
const defaultNews = [
  {
    id: 1,
    title: 'Запуск нового ИИ-агента',
    description: 'Мы обновили алгоритмы поиска. Теперь агент находит информацию в 2 раза быстрее и точнее.',
    image: 'https://picsum.photos/seed/ai/800/400',
    reactions: { like: 12, dislike: 2, fire: 5, heart: 8, people: 3, poop: 1, crown: 0 }
  },
  {
    id: 2,
    title: 'Обновление безопасности',
    description: 'Внедрена двухфакторная аутентификация для всех пользователей. Защита данных усилена.',
    image: 'https://picsum.photos/seed/security/800/400',
    reactions: { like: 24, dislike: 1, fire: 10, heart: 15, people: 7, poop: 0, crown: 2 }
  },
  {
    id: 3,
    title: 'Новая функция: слежка в реальном времени',
    description: 'Теперь вы можете отслеживать изменения по заданным параметрам в реальном времени.',
    image: 'https://picsum.photos/seed/tracking/800/400',
    reactions: { like: 8, dislike: 4, fire: 3, heart: 5, people: 2, poop: 1, crown: 0 }
  },
  {
    id: 4,
    title: 'Интеграция с Telegram',
    description: 'Теперь вы можете получать уведомления о найденной информации прямо в Telegram-бот.',
    image: 'https://picsum.photos/seed/telegram/800/400',
    reactions: { like: 3, dislike: 0, fire: 7, heart: 2, people: 1, poop: 0, crown: 0 }
  }
];

// Загружаем новости из localStorage
let newsData = [];
const saved = localStorage.getItem('newsData');
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      newsData = parsed;
    } else {
      newsData = JSON.parse(JSON.stringify(defaultNews));
      localStorage.setItem('newsData', JSON.stringify(newsData));
    }
  } catch (e) {
    newsData = JSON.parse(JSON.stringify(defaultNews));
    localStorage.setItem('newsData', JSON.stringify(newsData));
  }
} else {
  newsData = JSON.parse(JSON.stringify(defaultNews));
  localStorage.setItem('newsData', JSON.stringify(newsData));
}

// --- Рендеринг главной страницы (новости) ---
function renderMainPage() {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  contentArea.innerHTML = '';

  const feed = document.createElement('div');
  feed.className = 'news-feed';

  newsData.forEach(news => {
    const card = document.createElement('div');
    card.className = 'news-card';

    const img = document.createElement('img');
    img.src = news.image;
    img.alt = news.title;
    card.appendChild(img);

    const body = document.createElement('div');
    body.className = 'news-body';

    const title = document.createElement('div');
    title.className = 'news-title';
    title.textContent = news.title;
    body.appendChild(title);

    const desc = document.createElement('div');
    desc.className = 'news-description';
    desc.textContent = news.description;
    body.appendChild(desc);

    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'reactions';

    const reactionList = [
      { key: 'like', icon: 'fa-thumbs-up' },
      { key: 'dislike', icon: 'fa-thumbs-down' },
      { key: 'fire', icon: 'fa-fire' },
      { key: 'heart', icon: 'fa-heart' },
      { key: 'people', icon: 'fa-people-group' },
      { key: 'poop', icon: 'fa-poo' },
      { key: 'crown', icon: 'fa-crown' }
    ];

    reactionList.forEach(reaction => {
      const btn = document.createElement('button');
      btn.className = 'reaction-btn';
      btn.dataset.reaction = reaction.key;
      btn.dataset.newsId = news.id;

      const icon = document.createElement('i');
      icon.className = `fas ${reaction.icon}`;
      btn.appendChild(icon);

      const countSpan = document.createElement('span');
      countSpan.className = 'count';
      countSpan.textContent = news.reactions[reaction.key] || 0;
      btn.appendChild(countSpan);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        news.reactions[reaction.key] = (news.reactions[reaction.key] || 0) + 1;
        countSpan.textContent = news.reactions[reaction.key];
        localStorage.setItem('newsData', JSON.stringify(newsData));
      });

      reactionsDiv.appendChild(btn);
    });

    body.appendChild(reactionsDiv);
    card.appendChild(body);
    feed.appendChild(card);
  });

  contentArea.appendChild(feed);
}

// --- Рендеринг страницы "Поиск" ---
function renderSearchPage() {
  const contentArea = document.getElementById('content-area');
  if (!contentArea) return;

  // Очищаем контейнер
  contentArea.innerHTML = '';

  // Основной контейнер поиска
  const wrapper = document.createElement('div');
  wrapper.className = 'search-wrapper';

  // Левая колонка: поля ввода
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'search-fields';

  // Массив полей (placeholder, icon)
  const fieldsData = [
    { placeholder: 'Введите ФИО...', icon: 'fa-user' },
    { placeholder: 'Введите почту...', icon: 'fa-envelope' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите город...', icon: 'fa-city' },
    { placeholder: 'Введите страну...', icon: 'fa-flag' },
    { placeholder: 'Введите место работы/учебы...', icon: 'fa-building' },
    { placeholder: 'Введите дату рождения...', icon: 'fa-calendar' },
    { placeholder: 'Введите домен...', icon: 'fa-globe' },
    { placeholder: 'Введите SteamID...', icon: 'fa-gamepad' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите IP...', icon: 'fa-network-wired' },
    { placeholder: 'Введите номер телефона...', icon: 'fa-phone' },
    { placeholder: 'Введите ник...', icon: 'fa-user-tag' },
    { placeholder: 'Введите провайдер...', icon: 'fa-wifi' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' },
    { placeholder: 'Введите ссылку на соц сеть...', icon: 'fa-link' }
  ];

  fieldsData.forEach(field => {
    const div = document.createElement('div');
    div.className = 'search-field';

    const icon = document.createElement('i');
    icon.className = `fas ${field.icon}`;
    div.appendChild(icon);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = field.placeholder;
    input.className = 'search-input';
    div.appendChild(input);

    fieldsContainer.appendChild(div);
  });

  wrapper.appendChild(fieldsContainer);

  // Правая часть: консоль + кнопка
  const rightBlock = document.createElement('div');
  rightBlock.style.display = 'flex';
  rightBlock.style.flexDirection = 'column';
  rightBlock.style.alignItems = 'flex-start';
  rightBlock.style.gap = '10px';

  // Консоль
  const consoleWrapper = document.createElement('div');
  consoleWrapper.className = 'console-wrapper';

  // Заголовок консоли
  const header = document.createElement('div');
  header.className = 'console-header';
  header.innerHTML = `
    <i class="fas fa-terminal"></i>
    <span class="console-title">Console</span>
    <span class="console-subtitle">Your information output</span>
  `;
  consoleWrapper.appendChild(header);

  // Окно вывода
  const output = document.createElement('div');
  output.className = 'console-output';
  output.id = 'consoleOutput';
  consoleWrapper.appendChild(output);

  rightBlock.appendChild(consoleWrapper);

  // Кнопка "Найти"
  const searchBtn = document.createElement('button');
  searchBtn.className = 'search-btn';
  searchBtn.textContent = 'Найти';
  searchBtn.id = 'searchActionBtn';
  rightBlock.appendChild(searchBtn);

  wrapper.appendChild(rightBlock);
  contentArea.appendChild(wrapper);

  // Приветственное сообщение в консоль
  addConsoleMessage('Добро пожаловать в консоль поиска. Введите данные и нажмите "Найти".');

  // Обработчик кнопки "Найти"
  searchBtn.addEventListener('click', () => {
    // Собираем все заполненные поля
    const inputs = document.querySelectorAll('.search-input');
    const values = [];
    inputs.forEach(inp => {
      if (inp.value.trim() !== '') {
        values.push(inp.value.trim());
      }
    });
    if (values.length === 0) {
      addConsoleMessage('⚠️ Вы не ввели ни одного параметра для поиска.');
      return;
    }
    addConsoleMessage(`🔍 Запуск поиска по: ${values.join(', ')}`);
    // Здесь можно добавить имитацию поиска
    setTimeout(() => {
      addConsoleMessage('✅ Поиск завершён. Найдено 0 результатов (заглушка).');
    }, 1500);
  });
}

// --- Вспомогательная функция для добавления сообщений в консоль ---
function addConsoleMessage(text) {
  const output = document.getElementById('consoleOutput');
  if (!output) return;

  const line = document.createElement('div');
  line.className = 'console-line';

  // Текущая дата в формате 2026/12/53:18/30/50 (пример)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${year}/${month}/${day}:${hours}/${minutes}/${seconds}`;

  const timestampSpan = document.createElement('span');
  timestampSpan.className = 'timestamp';
  timestampSpan.textContent = `${timestamp} `;

  const messageSpan = document.createElement('span');
  messageSpan.className = 'message';
  messageSpan.textContent = text;

  line.appendChild(timestampSpan);
  line.appendChild(messageSpan);
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// --- Переключение вкладок ---
const menuBtns = document.querySelectorAll('.menu-btn');
const contentArea = document.getElementById('content-area');

menuBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    menuBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const page = btn.dataset.page;
    console.log(`Переключено на: ${page}`);

    switch (page) {
      case 'main':
        renderMainPage();
        break;
      case 'search':
        renderSearchPage();
        break;
      case 'history':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">📜 История поиска (в разработке)</div>`;
        break;
      case 'subscriptions':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">💳 Управление подписками (в разработке)</div>`;
        break;
      case 'settings':
        contentArea.innerHTML = `<div style="color:#929292; font-size:20px; text-align:center; margin-top:50px;">⚙️ Настройки (в разработке)</div>`;
        break;
      default:
        contentArea.innerHTML = '';
    }
  });
});

// --- Инициализация: показываем главное меню ---
renderMainPage();