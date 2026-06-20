import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LangSwitcher from '../components/LangSwitcher';
import logo from '../assets/logo.png';
import '../styles/main.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const { login } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    ru: {
      emailPlaceholder: 'Введите email...',
      passwordPlaceholder: 'Введите пароль...',
      agreeLabel: 'Я принимаю пользовательское соглашение Terms of Service и политику конфиденциальности проекта.',
      loginBtn: 'Войти',
      forgotLink: 'Забыл пароль?',
      registerLink: 'Зарегистрироваться',
    },
    en: {
      emailPlaceholder: 'Enter email...',
      passwordPlaceholder: 'Enter password...',
      agreeLabel: 'I accept the Terms of Service and Privacy Policy.',
      loginBtn: 'Login',
      forgotLink: 'Forgot password?',
      registerLink: 'Register',
    },
  };

  const t = texts[lang] || texts.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      alert('Вы должны принять пользовательское соглашение');
      return;
    }
    try {
      const user = await login(email, password);
      if (user.subscription_type === 'admin' || (user.subscription_type !== 'free' && new Date(user.subscription_until) > new Date())) {
        navigate('/dashboard');
      } else {
        navigate('/pricing');
      }
    } catch (error) {
      alert('Ошибка входа: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
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
          <div className="top-links">
            <Link to="/forgot-password" className="forgot-link">{t.forgotLink}</Link>
            <Link to="/register" className="register-link">{t.registerLink}</Link>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                />
                <span>{t.agreeLabel}</span>
              </label>
            </div>
            <button type="submit">{t.loginBtn}</button>
          </form>
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

export default Login;