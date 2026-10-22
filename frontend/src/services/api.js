import data from '../mocks/mockData.json';

const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

export const api = {
  async login({ email, password }) {
    await delay();
    const user = data.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales inválidas');
    const { password: _, ...safe } = user;
    return { token: 'fake-jwt', user: safe };
  },
  async getProducts() {
    await delay();
    return data.products;
  },
  async createOrder(payload) {
    await delay();
    return { orden_id: 100, estado_orden: 'PAGADA', monto_total: payload.monto_total };
  }
};
