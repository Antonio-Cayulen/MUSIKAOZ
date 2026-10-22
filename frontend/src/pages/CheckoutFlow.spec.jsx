import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { __setOrderTransport, __resetOrderTransport } from '../services/orderService';
import App from '../App';

const clickByText = (text) => {
  fireEvent.click(screen.getByText(text));
};

describe('Flujo BEAT con licencia hasta checkout', () => {
  let captured;

  beforeEach(() => {
    localStorage.clear();
    captured = null;
    __setOrderTransport(async (body) => {
      captured = body;
      return { orderId: 100, estadoOrden: 'PAGADA', montoTotal: body.montoTotal };
    });
  });

  afterEach(() => {
    __resetOrderTransport();
  });

  it('agrega un BEAT con licencia EXCLUSIVA y envía el body correcto a createOrder', async () => {
    localStorage.setItem(
      'marketplace.auth',
      JSON.stringify({ id: 5, name: 'buyer', email: 'buyer@gmail.com', role: 'USER' })
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // 1) Ir a la card del beat específico (evita ambigüedad con otros beats)
    const card = (await screen.findByText('Trap Beat Midnight')).closest('article');
    fireEvent.click(within(card).getByText('VER LICENCIAS'));

    // 2) Esperar a que ProductDetail resuelva el producto
    await screen.findByText('SELECCIONA LICENCIA');

    // 3) Seleccionar la licencia EXCLUSIVA (por testid idealmente; si no, por scope)
    const exclusivaName = screen
      .getAllByText('EXCLUSIVA')
      .find((el) => el.classList.contains('product-detail__licencia-name'));
    const exclusivaLabel = exclusivaName.closest('label');
    const radio = exclusivaLabel.querySelector('input[type="radio"]');
    fireEvent.click(radio);

    // 4) Añadir al carrito
    clickByText('AÑADIR AL CARRITO');

    // 5) Ir al carrito y pagar
    await screen.findByText('IR A PAGAR');
    clickByText('IR A PAGAR');

    // 6) Confirmar orden
    await screen.findByText('CONFIRMAR ORDEN');
    clickByText('CONFIRMAR ORDEN');

    // 7) Verificar UI
    await waitFor(() => {
      expect(screen.getByText('ORDEN CONFIRMADA')).toBeTruthy();
    });

    // 8) Verificar el body enviado
    expect(captured).toBeTruthy();
    expect(captured.compradorId).toBe(5);
    expect(captured.montoTotal).toBeCloseTo(199.99, 2);
    expect(captured.items.length).toBe(1);          // ← no .toHaveLength

    const item = captured.items[0];
    expect(item.productoId).toBe(1);
    expect(item.licenciaId).toBe(12);
    expect(item.cantidad).toBe(1);
    expect(item.precioUnitario).toBeCloseTo(199.99, 2);
    expect(item.nombreSnapshot).toBe('Trap Beat Midnight (EXCLUSIVA)');
  });
});