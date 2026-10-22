import mockData from '../mocks/mockData.json';

const SIMULATED_LATENCY_MS = 300;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProducts = async () => {
  await delay(SIMULATED_LATENCY_MS);
  // Copia defensiva: evita mutaciones accidentales del JSON importado.
  return mockData.products.map((product) => ({ ...product }));
};

export const getActiveProducts = async () => {
  const products = await getProducts();
  return products.filter((product) => product.estado === 'ACTIVO');
};
