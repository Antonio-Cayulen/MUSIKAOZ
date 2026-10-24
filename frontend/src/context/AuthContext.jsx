import { createContext, useContext, useMemo, useState } from 'react';
import { db } from '../data/db.js';

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

  const login = async ({ email, password }) => {
    if (!isValidEmail(email) || !isValidPassword(password)) {
      return { ok: false, error: 'CREDENCIALES INVÁLIDAS' };
    }

    const normalized = email.trim().toLowerCase();
    const found = await db.findBy(
      'users',
      `item.email === ${JSON.stringify(normalized)} && item.password === ${JSON.stringify(password)}`
    );

    if (!found) {
      return { ok: false, error: 'USUARIO O CONTRASEÑA INCORRECTOS' };
    }

    const nextUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const register = async ({ email, password }) => {
    if (!isValidEmail(email)) {
      return { ok: false, error: 'CORREO INVÁLIDO' };
    }
    if (!isValidPassword(password)) {
      return { ok: false, error: 'CONTRASEÑA DEBE TENER ENTRE 4 Y 10 CARACTERES' };
    }

    const normalized = email.trim().toLowerCase();
    const existing = await db.findBy(
      'users',
      `item.email === ${JSON.stringify(normalized)}`
    );
    if (existing) {
      return { ok: false, error: 'EMAIL YA REGISTRADO' };
    }

    const created = await db.create('users', {
      email: normalized,
      password,
      name: normalized.split('@')[0],
      role: 'USER',
    });

    const nextUser = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return { ok: true };
  };

  const value = useMemo(
    () => ({ user, login, register, logout, isAuthenticated: !!user }),
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