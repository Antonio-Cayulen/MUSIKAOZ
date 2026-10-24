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

const buildKey = (productoId, licenciaId) =>
  `${productoId}::${licenciaId === null || licenciaId === undefined ? 'PHYS' : licenciaId}`;

const buildSnapshotName = (nombre, licenciaNombre) =>
  licenciaNombre ? `${nombre} (${licenciaNombre})` : nombre;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = ({
    productoId,
    nombre,
    tipoProducto,
    precioUnitario,
    licenciaId = null,
    licenciaNombre = null,
    imagenUrl = '',
    cantidad = 1,
    marketStatus = 'DISPONIBLE',
  }) => {
    if (tipoProducto === 'BEAT' && (licenciaId === null || licenciaId === undefined)) {
      throw new Error('Los BEAT requieren licenciaId');
    }
    if (marketStatus !== 'DISPONIBLE') {
      throw new Error('El producto no está disponible para compra');
    }

    const key = buildKey(productoId, licenciaId);
    const nombreSnapshot = buildSnapshotName(nombre, licenciaNombre);

    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [
        ...current,
        {
          key,
          productoId,
          licenciaId,
          nombreSnapshot,
          precioUnitario,
          cantidad,
          imagenUrl,
          tipoProducto,
        },
      ];
    });
  };

  const removeItem = (key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(
    () =>
      items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0),
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