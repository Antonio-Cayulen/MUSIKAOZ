import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'marketplace.auth';

const ALLOWED_DOMAINS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

export const isValidEmail = (email) =>
  typeof email === 'string' &&
  ALLOWED_DOMAINS.some((domain) => email.trim().toLowerCase().endsWith(domain));

export const isValidPassword = (password) =>
  typeof password === 'string' &&
  password.length >= 4 &&
  password.length <= 10;

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredAuth);

  const login = ({ email, password }) => {
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return { ok: false, error: 'CREDENCIALES INVÁLIDAS' };
    }

    // Mock del contrato POST /api/auth/login.
    const role = email.trim().toLowerCase().startsWith('admin@') ? 'ADMIN' : 'USER';
    const nextUser = {
      id: 1,
      name: email.split('@')[0],
      email,
      role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
};
