import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LangSwitcher from '../components/LangSwitcher';
import api from '../services/api';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { lang } = useLanguage();

  const texts = {
    ru: {
      emailPlaceholder: 'Введите email...',
      submitBtn: 'Восстановить пароль',
      backLink: 'Вернуться ко входу',
    },
    en: {
      emailPlaceholder: 'Enter email...',
      submitBtn: 'Recover password',
      backLink: 'Back to login',
    },
  };

  const t = texts[lang] || texts.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/forgot-password/', { email });
      alert('Инструкция по восстановлению пароля отправлена на ваш email (если он зарегистрирован).');
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    }
  };

  return (
    <div className="auth-page">
      <LangSwitcher />
      <div className="wrapper">
        <div className="container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2>{t.title}</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="forgot-btn">{t.submitBtn}</button>
          </form>
          <div className="bottom-link">
            <Link to="/login">{t.backLink}</Link>
          </div>
        </div>
        <div className="footer">
          <div className="footer-content">
            <span className="copyright">2026 Jeos. All rights reserved.</span>
            <div className="footer-links">
              <Link to="/terms-of-use">Terms of Use</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/contact-us">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;