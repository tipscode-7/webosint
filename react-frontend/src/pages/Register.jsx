import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LangSwitcher from '../components/LangSwitcher';
import { showLoader, hideLoader } from '../components/Loader';
import logo from '../assets/logo.png';
import googleIcon from '../assets/google-icon.png';
import vkIcon from '../assets/vk-icon.png';
import discordIcon from '../assets/discord-icon.png';
import telegramIcon from '../assets/telegram-icon.png';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [agree, setAgree] = useState(false);
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    ru: {
      emailPlaceholder: 'Введите email...',
      usernamePlaceholder: 'Введите логин...',
      passwordPlaceholder: 'Введите пароль...',
      password2Placeholder: 'Повторите пароль...',
      agreeLabel: 'Я принимаю пользовательское соглашение Terms of Service и политику конфиденциальности проекта.',
      registerBtn: 'Зарегистрироваться',
      loginLink: 'Уже есть аккаунт?',
    },
    en: {
      emailPlaceholder: 'Enter email...',
      usernamePlaceholder: 'Enter username...',
      passwordPlaceholder: 'Enter password...',
      password2Placeholder: 'Repeat password...',
      agreeLabel: 'I accept the Terms of Service and Privacy Policy.',
      registerBtn: 'Register',
      loginLink: 'Already have an account?',
    },
  };

  const t = texts[lang] || texts.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert('Вы должны принять пользовательское соглашение');
      return;
    }
    if (password !== password2) {
      alert('Пароли не совпадают');
      return;
    }
    try {
      showLoader();
      await api.post('/register/', { email, username, password });
      hideLoader();
      navigate('/verify-code');
    } catch (error) {
      hideLoader();
      alert('Ошибка регистрации: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
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
          <div className="social-login">
            <div className="social-icon"><img src={googleIcon} alt="Google" /></div>
            <div className="social-icon"><img src={vkIcon} alt="VK" /></div>
            <div className="social-icon"><img src={discordIcon} alt="Discord" /></div>
            <div className="social-icon"><img src={telegramIcon} alt="Telegram" /></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input type="text" placeholder={t.usernamePlaceholder} value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder={t.password2Placeholder} value={password2} onChange={(e) => setPassword2(e.target.value)} required />
            </div>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
                <span>{t.agreeLabel}</span>
              </label>
            </div>
            <button type="submit" className="register-btn">{t.registerBtn}</button>
          </form>
          <div className="bottom-link">
            <Link to="/login">{t.loginLink}</Link>
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

export default Register;