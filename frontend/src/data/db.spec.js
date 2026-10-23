import {
  db,
  list,
  findById,
  findBy,
  create,
  update,
  remove,
  resetDatabase,
} from './db.js';

describe('db', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
  });

  it('seedea productos y usuarios al inicializar', async () => {
    const products = await list('products');
    const users = await list('users');
    expect(products.length).toBe(6);
    expect(users.length).toBe(3);
  });

  it('findById devuelve el producto o null', async () => {
    const found = await findById('products', 1);
    expect(found.nombre).toBe('Trap Beat Midnight');
    const missing = await findById('products', 999);
    expect(missing).toBeNull();
  });

  it('findBy localiza un usuario por email', async () => {
    const user = await findBy('users', "item.email === 'admin@duoc.cl'");
    expect(user.role).toBe('ADMIN');
  });

  it('create añade una entidad con id autoincremental', async () => {
    const created = await create('products', {
      nombre: 'Nuevo Beat',
      precioBase: 10,
      tipoProducto: 'BEAT',
      estado: 'ACTIVO',
      imagenUrl: '',
    });
    expect(created.id).toBe(7);
    const all = await list('products');
    expect(all.length).toBe(7);
    expect(all.find((p) => p.id === 7).nombre).toBe('Nuevo Beat');
  });

  it('update modifica campos preservando id', async () => {
    const updated = await update('products', 1, { estado: 'INACTIVO' });
    expect(updated.id).toBe(1);
    expect(updated.estado).toBe('INACTIVO');
    const fetched = await findById('products', 1);
    expect(fetched.estado).toBe('INACTIVO');
  });

  it('remove elimina físicamente una entidad', async () => {
    const ok = await remove('products', 2);
    expect(ok).toBe(true);
    const missing = await findById('products', 2);
    expect(missing).toBeNull();
    const all = await list('products');
    expect(all.length).toBe(5);
  });

  it('reset restaura el seed original', async () => {
    await remove('products', 1);
    await resetDatabase();
    const all = await list('products');
    expect(all.length).toBe(6);
    expect(all[0].id).toBe(1);
  });

  it('persiste entre lecturas sucesivas', async () => {
    await update('users', 3, { role: 'ADMIN' });
    const user = await findById('users', 3);
    expect(user.role).toBe('ADMIN');
  });

  it('devuelve copias defensivas (mutar el resultado no altera la db)', async () => {
    const products = await list('products');
    products[0].nombre = 'MUTADO';
    const refetched = await findById('products', 1);
    expect(refetched.nombre).toBe('Trap Beat Midnight');
  });

  it('create en colección vacía usa id 1', async () => {
    const order = await create('orders', { compradorId: 3, montoTotal: 0, items: [] });
    expect(order.id).toBe(1);
  });

  it('update sobre id inexistente devuelve null', async () => {
    const result = await update('products', 999, { estado: 'INACTIVO' });
    expect(result).toBeNull();
  });
});