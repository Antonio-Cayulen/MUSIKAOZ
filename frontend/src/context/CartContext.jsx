import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'marketplace.cart';

const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          nombre: product.nombre,
          precioBase: product.precioBase,
          imagenUrl: product.imagenUrl,
          tipoProducto: product.tipoProducto,
          cantidad: 1,
        },
      ];
    });
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.precioBase * item.cantidad, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearCart, total }),
    [items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
};
