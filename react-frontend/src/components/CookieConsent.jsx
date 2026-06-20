import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';  // ← импорт логотипа


/**
 * Баннер согласия на использование куки.
 * Сохраняет состояние в localStorage.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div id="cookie-consent-banner">
      <div className="cookie-content">
        <p>
          Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
          <Link to="/privacy-policy">Политикой конфиденциальности</Link>.
        </p>
        <button id="cookie-accept-btn" onClick={acceptCookies}>
          Принять
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;