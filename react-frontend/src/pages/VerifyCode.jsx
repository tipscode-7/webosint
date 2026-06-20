import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { showLoader, hideLoader } from '../components/Loader';
import logo from '../assets/logo.png';

const VerifyCode = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const texts = {
    ru: {
      title: 'Введите код подтверждения',
      sub: 'Мы отправили 4-значный код на вашу почту',
      verifyBtn: 'Подтвердить',
      timerLabel: 'Отправить повторно через ',
      sec: ' сек',
      resend: 'Отправить повторно',
    },
    en: {
      title: 'Enter verification code',
      sub: 'We sent a 4-digit code to your email',
      verifyBtn: 'Verify',
      timerLabel: 'Resend in ',
      sec: ' sec',
      resend: 'Resend',
    },
  };

  const t = texts[lang] || texts.ru;

  useEffect(() => {
    inputRefs[0].current?.focus();
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      alert('Введите все 4 цифры');
      return;
    }
    try {
      showLoader();
      // const res = await api.post('/verify-code/', { code: fullCode });
      alert(`Код ${fullCode} подтверждён (заглушка)`);
      hideLoader();
      navigate('/login');
    } catch (error) {
      hideLoader();
      alert('Неверный код. Попробуйте снова.');
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  const handleResend = async () => {
    alert('Новый код отправлен на вашу почту');
    setTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="verify-wrapper">
        <div className="verify-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2>{t.title}</h2>
          <p className="verify-sub">{t.sub}</p>
          <form onSubmit={handleSubmit}>
            <div className="code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="code-digit"
                  maxLength="1"
                  inputMode="numeric"
                  pattern="[0-9]"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={inputRefs[index]}
                  required
                />
              ))}
            </div>
            <button type="submit" className="verify-btn">{t.verifyBtn}</button>
          </form>
          <div className="verify-bottom">
            {canResend ? (
              <a href="#" className="resend-link" onClick={handleResend}>{t.resend}</a>
            ) : (
              <span className="timer">{t.timerLabel}{timer}{t.sec}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;