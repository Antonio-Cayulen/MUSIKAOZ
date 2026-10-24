import { resetDatabase, db } from '../data/db.js';
import { createOrder, __resetOrderTransport } from './orderService.js';

describe('orderService.stock', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
    __resetOrderTransport();
  });

  it('rechaza la orden completa si el stock de un EQUIPO es insuficiente', async () => {
    await db.update('products', 2, { stock: 1 });

    const body = {
      compradorId: 3,
      montoTotal: 300,
      items: [
        {
          productoId: 2,
          licenciaId: null,
          cantidad: 2,
          precioUnitario: 150,
          nombreSnapshot: 'Micrófono Condensador',
        },
      ],
    };

    let error;
    try {
      await createOrder(body);
    } catch (err) {
      error = err;
    }

    expect(error).toBeTruthy();
    expect(error.message).toContain('STOCK INSUFICIENTE');

    const product = await db.findById('products', 2);
    expect(product.stock).toBe(1);

    const orders = await db.list('orders');
    expect(orders.length).toBe(0);
  });

  it('descuenta stock del EQUIPO al confirmar la orden', async () => {
    const body = {
      compradorId: 3,
      montoTotal: 300,
      items: [
        {
          productoId: 2,
          licenciaId: null,
          cantidad: 2,
          precioUnitario: 150,
          nombreSnapshot: 'Micrófono Condensador',
        },
      ],
    };

    await createOrder(body);

    const product = await db.findById('products', 2);
    expect(product.stock).toBe(3);

    const orders = await db.list('orders');
    expect(orders.length).toBe(1);
  });
});