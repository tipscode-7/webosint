import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Создаём контекст
const AuthContext = createContext();

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

  // При монтировании проверяем токен и получаем профиль
  useEffect(() => {
    const loadUser = async () => {
      if (accessToken) {
        try {
          const response = await api.get('/profile/');
          setUser(response.data);
        } catch (error) {
          // Если токен невалиден, удаляем его
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setAccessToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [accessToken]);

  // Функция входа
  const login = async (email, password) => {
    const response = await api.post('/login/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setAccessToken(access);
    // Получаем профиль после входа
    const profile = await api.get('/profile/');
    setUser(profile.data);
    return profile.data;
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
  };

  const value = { user, loading, login, logout, accessToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};