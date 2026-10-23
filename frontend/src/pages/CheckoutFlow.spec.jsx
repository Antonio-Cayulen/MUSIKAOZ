import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { resetDatabase, db } from '../data/db.js';
import { __setOrderTransport, __resetOrderTransport } from '../services/orderService';
import App from '../App';

describe('Flujo BEAT con licencia EXCLUSIVA hasta checkout', () => {
  let captured;
  let user;

  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
    captured = null;
    user = userEvent.setup();   // ← crea el userEvent por test
    __setOrderTransport(async (body) => {
      captured = body;
      return { orderId: 0, estadoOrden: 'PAGADA', montoTotal: body.montoTotal };
    });
  });

  afterEach(() => {
    __resetOrderTransport();
  });

  it('loguea, agrega exclusiva, checkout y marca la licencia como vendida', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // ─── Login ───
    await user.type(screen.getByLabelText(/correo/i), 'buyer@gmail.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'buyer123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // ─── Catálogo: espera a que aparezca el primer producto ───
    await screen.findByText('Trap Beat Midnight');

    // ─── Click "VER LICENCIAS" DEL CARD DE Trap Beat Midnight ───
    const trapCard = screen.getByText('Trap Beat Midnight').closest('article');
    const link = trapCard.querySelector('a');
    await user.click(link);

    // ─── Detalle de producto ───
    await screen.findByText('SELECCIONA LICENCIA');

    // ─── Seleccionar la licencia EXCLUSIVA ───
    const radio = document.querySelector('input[type="radio"][value="12"]');
    if (!radio) throw new Error('No se encontró el radio de la licencia EXCLUSIVA (value="12")');
    await user.click(radio);

    // ─── Agregar al carrito e ir a pagar ───
    await user.click(screen.getByText('AÑADIR AL CARRITO'));

    await screen.findByText('IR A PAGAR');
    await user.click(screen.getByText('IR A PAGAR'));

    // ─── Confirmar orden ───
    await screen.findByText('CONFIRMAR ORDEN');
    await user.click(screen.getByText('CONFIRMAR ORDEN'));

    await waitFor(() => {
      expect(screen.getByText('ORDEN CONFIRMADA')).toBeTruthy();
    });

    // ─── Asserts sobre el body enviado ───
    expect(captured.compradorId).toBe(3);
    expect(captured.montoTotal).toBeCloseTo(199.99, 2);
    expect(captured.items[0].licenciaId).toBe(12);
    expect(captured.items[0].nombreSnapshot).toBe('Trap Beat Midnight (EXCLUSIVA)');

    // ─── Asserts sobre la DB ───
    const product = await db.findById('products', 1);
    const licencia = product.licencias.find((l) => l.id === 12);
    expect(licencia.vendida).toBe(true);

    const orders = await db.list('orders');
    expect(orders.length).toBe(1);
    expect(orders[0].compradorId).toBe(3);
  });
});