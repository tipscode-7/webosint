import api from '../api.js';

if (!localStorage.getItem('access_token')) {
  window.location.href = '/login.html';
}

// Обработка кнопок "Buy" (все кроме disabled)
const buttons = document.querySelectorAll('.card-btn:not(:disabled)');
buttons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const plan = btn.dataset.plan;
    try {
      // В реальности здесь POST на /api/subscribe/
      // пока имитация
      const res = await api.post('/subscribe/', { plan });
      if (res.data.success) {
        localStorage.setItem('subscription_type', res.data.subscription_type);
        localStorage.setItem('subscription_until', res.data.subscription_until);
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      alert('Ошибка оформления подписки: ' + (err.response?.data?.detail || 'Попробуйте позже'));
    }
  });
});

// --- Переключение языков ---
const langBtns = document.querySelectorAll('.lang-btn');
function setLanguage(lang) {
  langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  const texts = {
    ru: {
      free: 'Free',
      day: '1 Day',
      week: '1 Week',
      month: '1 Month',
      year: '1 Year',
      inf: 'Infinity',
      buy: 'Buy',
      current: 'Текущий',
      logout: 'Выйти',
      desc_free: 'Базовый доступ',
      desc_day: 'Пробный период',
      desc_week: 'Полный функционал',
      desc_month: 'Оптимальный выбор',
      desc_year: 'Экономия 30%',
      desc_inf: 'Безлимит навсегда',
    },
    en: {
      free: 'Free',
      day: '1 Day',
      week: '1 Week',
      month: '1 Month',
      year: '1 Year',
      inf: 'Infinity',
      buy: 'Buy',
      current: 'Current',
      logout: 'Logout',
      desc_free: 'Basic access',
      desc_day: 'Trial period',
      desc_week: 'Full features',
      desc_month: 'Best value',
      desc_year: 'Save 30%',
      desc_inf: 'Unlimited forever',
    }
  };
  const t = texts[lang] || texts.ru;
  document.querySelector('.container h2').textContent = t.title;
  // Обновляем текст на карточках
  const cards = document.querySelectorAll('.pricing-card-h');
  const titles = [t.free, t.day, t.week, t.month, t.year, t.inf];
  const descs = [t.desc_free, t.desc_day, t.desc_week, t.desc_month, t.desc_year, t.desc_inf];
  cards.forEach((card, i) => {
    const titleEl = card.querySelector('.card-title');
    const descEl = card.querySelector('.card-desc');
    const btn = card.querySelector('.card-btn');
    if (titleEl) titleEl.textContent = titles[i] || '';
    if (descEl) descEl.textContent = descs[i] || '';
    if (btn) {
      if (btn.disabled) btn.textContent = t.current;
      else btn.textContent = t.buy;
    }
  });
  // Ссылка "Выйти"
  const logoutLink = document.querySelector('.bottom-link a');
  if (logoutLink) logoutLink.textContent = t.logout;
}

langBtns.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});
setLanguage('ru');