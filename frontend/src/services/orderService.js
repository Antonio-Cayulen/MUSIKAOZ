import { db } from '../data/db.js';

const SIMULATED_LATENCY_MS = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let transport = async (body) => {
  await delay(SIMULATED_LATENCY_MS);
  return { orderId: 0, estadoOrden: 'PAGADA', montoTotal: body.montoTotal };
};

export const __setOrderTransport = (next) => {
  transport = next;
};

export const __resetOrderTransport = () => {
  transport = async (body) => {
    await delay(SIMULATED_LATENCY_MS);
    return { orderId: 0, estadoOrden: 'PAGADA', montoTotal: body.montoTotal };
  };
};

const persistOrder = async (body) => {
  const order = await db.create('orders', {
    compradorId: body.compradorId,
    montoTotal: body.montoTotal,
    items: body.items,
    estadoOrden: 'PAGADA',
  });

  for (const item of body.items) {
    if (item.licenciaId === null) continue;
    const product = await db.findById('products', item.productoId);
    if (!product || !product.licencias) continue;
    const target = product.licencias.find((l) => l.id === item.licenciaId);
    if (!target || target.nombre !== 'EXCLUSIVA') continue;
    const updatedLicencias = product.licencias.map((l) =>
      l.id === item.licenciaId ? { ...l, vendida: true } : l
    );
    await db.update('products', product.id, { licencias: updatedLicencias });
  }

  return order;
};

export const createOrder = async (body) => {
  const result = await transport(body);

  const exclusivaVendida = await (async () => {
    for (const item of body.items) {
      if (item.licenciaId === null) continue;
      const product = await db.findById('products', item.productoId);
      if (!product || !product.licencias) continue;
      const target = product.licencias.find((l) => l.id === item.licenciaId);
      if (target && target.nombre === 'EXCLUSIVA' && target.vendida) return true;
    }
    return false;
  })();

  if (exclusivaVendida) {
    throw new Error('LICENCIA EXCLUSIVA YA VENDIDA');
  }

  const order = await persistOrder(body);
  return {
    orderId: order.id,
    estadoOrden: order.estadoOrden,
    montoTotal: order.montoTotal,
  };
};