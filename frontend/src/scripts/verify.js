// --- Автоматический переход между полями ---
const digits = document.querySelectorAll('.code-digit');
const form = document.getElementById('verifyForm');
const timerSpan = document.getElementById('timer');
const resendLink = document.getElementById('resendLink');

let timerInterval;
let secondsLeft = 60;

// Фокус на первом поле при загрузке
digits[0].focus();

digits.forEach((input, index) => {
  // При вводе цифры переходим к следующему полю
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    // Оставляем только одну цифру
    if (value.length > 1) {
      e.target.value = value.slice(0, 1);
    }
    // Если введена цифра, переходим к следующему полю
    if (value.length === 1 && index < digits.length - 1) {
      digits[index + 1].focus();
    }
    // Если все поля заполнены, можно автоматически отправить форму (опционально)
    const allFilled = Array.from(digits).every(d => d.value.length === 1);
    if (allFilled) {
      // Можно сразу отправить, но лучше дать пользователю нажать кнопку
    }
  });

  // При нажатии Backspace очищаем текущее поле и переходим к предыдущему
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value === '' && index > 0) {
      digits[index - 1].focus();
    }
  });

  // Ограничиваем ввод только цифрами
  input.addEventListener('keypress', (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
      e.preventDefault();
    }
  });
});

// --- Обработка отправки формы ---
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = Array.from(digits).map(d => d.value).join('');
  if (code.length !== 4) {
    alert('Введите все 4 цифры');
    return;
  }

  // Здесь должен быть запрос на бэкенд для проверки кода
  // Пока имитация
  try {
    // const res = await api.post('/verify-code/', { code });
    // if (res.data.success) {
    //   window.location.href = '/login.html';
    // }
    // Заглушка:
    alert(`Код ${code} подтверждён (заглушка)`);
    window.location.href = '/login.html';
  } catch (err) {
    alert('Неверный код. Попробуйте снова.');
    // Очищаем поля
    digits.forEach(d => d.value = '');
    digits[0].focus();
  }
});

// --- Таймер для повторной отправки ---
function startTimer() {
  secondsLeft = 60;
  timerSpan.textContent = secondsLeft;
  resendLink.style.display = 'none';
  timerSpan.parentElement.style.display = 'inline-block';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsLeft--;
    timerSpan.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerSpan.parentElement.style.display = 'none';
      resendLink.style.display = 'inline-block';
    }
  }, 1000);
}

import { showLoader, hideLoader } from './loader.js';

// При отправке формы:
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // ...
  try {
    showLoader();
    const res = await api.post('/verify-code/', { code });
    hideLoader();
    // ...
  } catch (err) {
    hideLoader();
    // ошибка
  }
});

// При клике на "Отправить повторно"
resendLink.addEventListener('click', () => {
  // Здесь запрос на повторную отправку кода
  alert('Новый код отправлен на вашу почту');
  startTimer();
});

// Запускаем таймер при загрузке
startTimer();