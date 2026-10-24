import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const beat = (overrides = {}) => ({
  productoId: 1,
  nombre: 'Trap Beat Midnight',
  tipoProducto: 'BEAT',
  precioUnitario: 29.99,
  licenciaId: 11,
  licenciaNombre: 'NO_EXCLUSIVA',
  cantidad: 1,
  ...overrides,
});

const equipo = (overrides = {}) => ({
  productoId: 2,
  nombre: 'Micrófono Condensador',
  tipoProducto: 'EQUIPO',
  precioUnitario: 150,
  licenciaId: null,
  cantidad: 1,
  ...overrides,
});

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    spyOn(localStorage, 'setItem').and.callThrough();
  });

  it('guarda licenciaId y precioUnitario al agregar un BEAT', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(beat());
    });

    const item = result.current.items[0];
    expect(item.licenciaId).toBe(11);
    expect(item.precioUnitario).toBe(29.99);
    expect(item.nombreSnapshot).toBe('Trap Beat Midnight (NO_EXCLUSIVA)');
  });

  it('guarda licenciaId=null y nombre simple para EQUIPO', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(equipo());
    });

    const item = result.current.items[0];
    expect(item.licenciaId).toBeNull();
    expect(item.nombreSnapshot).toBe('Micrófono Condensador');
  });

  it('rechaza agregar un BEAT sin licenciaId', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(() => {
      result.current.addItem(beat({ licenciaId: null }));
    }).toThrowError();
  });

  it('suma correctamente el total usando precioUnitario * cantidad', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(beat({ productoId: 1, licenciaId: 11, precioUnitario: 10 }));
      result.current.addItem(equipo({ productoId: 2, precioUnitario: 20 }));
      result.current.addItem(beat({ productoId: 3, licenciaId: 12, precioUnitario: 5, cantidad: 2 }));
    });

    // 10*1 + 20*1 + 5*2 = 40
    expect(result.current.total).toBe(40);
  });

  it('incrementa cantidad si productoId + licenciaId coinciden', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(beat({ productoId: 1, licenciaId: 11 }));
      result.current.addItem(beat({ productoId: 1, licenciaId: 11 }));
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].cantidad).toBe(2);
  });

  it('llama a localStorage.setItem al agregar un producto', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(beat());
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('rechaza agregar un beat RETIRADO', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(() => {
      result.current.addItem(beat({ marketStatus: 'RETIRADO' }));
    }).toThrowError();
  });
});