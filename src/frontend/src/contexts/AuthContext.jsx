import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth as authApi } from '../api/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem('novacart_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.getMe()
      .then((response) => {
        setUser(response.data.data);
      })
      .catch(() => {
        window.localStorage.removeItem('novacart_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    window.localStorage.setItem('novacart_token', response.data.data.token);
    setUser(response.data.data.user);
    return response;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    window.localStorage.setItem('novacart_token', response.data.data.token);
    setUser(response.data.data.user);
    return response;
  };

  const logout = () => {
    window.localStorage.removeItem('novacart_token');
    setUser(null);
    authApi.logout().catch(() => null);
  };

  const updateProfile = async (payload) => {
    const response = await authApi.updateProfile(payload);
    setUser(response.data.data);
    return response;
  };

  const value = useMemo(() => ({ user, login, register, logout, updateProfile, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
