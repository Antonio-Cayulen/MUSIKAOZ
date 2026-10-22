import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    spyOn(localStorage, 'setItem').and.callThrough();
  });

  it('suma correctamente el total de 3 productos distintos', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: 1, nombre: 'A', precioBase: 10, tipoProducto: 'BEAT' });
      result.current.addItem({ id: 2, nombre: 'B', precioBase: 20, tipoProducto: 'EQUIPO' });
      result.current.addItem({ id: 3, nombre: 'C', precioBase: 5, tipoProducto: 'BEAT' });
    });

    expect(result.current.total).toBe(35);
  });

  it('llama a localStorage.setItem al agregar un producto', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({ id: 9, nombre: 'X', precioBase: 1, tipoProducto: 'BEAT' });
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
