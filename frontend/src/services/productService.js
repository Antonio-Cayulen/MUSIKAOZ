import { db } from '../data/db.js';

const SIMULATED_LATENCY_MS = 300;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMarketStatus = (product) => {
  if (!product) return null;
  if (product.estado === 'INACTIVO') return 'INACTIVO';
  const exclusiva = product.licencias?.find((l) => l.nombre === 'EXCLUSIVA');
  if (exclusiva?.vendida) return 'RETIRADO';
  return 'DISPONIBLE';
};

export const getProducts = async () => {
  await delay(SIMULATED_LATENCY_MS);
  return db.list('products');
};

export const getActiveProducts = async () => {
  const products = await getProducts();
  return products.filter((product) => product.estado !== 'INACTIVO');
};

export const getProductById = async (id) => {
  await delay(SIMULATED_LATENCY_MS);
  return db.findById('products', id);
};

export const createProduct = async (payload) => {
  await delay(SIMULATED_LATENCY_MS);
  const { licencias, ...base } = payload;
  return db.create('products', {
    ...base,
    estado: base.estado ?? 'ACTIVO',
    ...(licencias ? { licencias } : {}),
  });
};

export const updateProduct = async (id, patch) => {
  await delay(SIMULATED_LATENCY_MS);
  const { licencias, ...safePatch } = patch;
  return db.update('products', id, safePatch);
};

export const softDeleteProduct = async (id) => {
  await delay(SIMULATED_LATENCY_MS);
  return db.update('products', id, { estado: 'INACTIVO' });
};

export const restoreProduct = async (id) => {
  await delay(SIMULATED_LATENCY_MS);
  return db.update('products', id, { estado: 'ACTIVO' });
};

export const hardDeleteProduct = async (id) => {
  await delay(SIMULATED_LATENCY_MS);
  return db.remove('products', id);
};