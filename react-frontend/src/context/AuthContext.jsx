import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useSubscription } from './SubscriptionContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateSubscription } = useSubscription();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/profile/')
        .then(response => {
          setUser(response.data);
          // Обновляем подписку в контексте
          updateSubscription(response.data.subscription_type, response.data.subscription_until);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // Получаем профиль
    const profile = await api.get('/profile/');
    setUser(profile.data);
    updateSubscription(profile.data.subscription_type, profile.data.subscription_until);
    return profile.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};