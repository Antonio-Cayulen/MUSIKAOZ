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

const validateStock = async (items) => {
  for (const item of items) {
    const product = await db.findById('products', item.productoId);
    if (!product) {
      throw new Error(`PRODUCTO NO ENCONTRADO: ${item.productoId}`);
    }
    if (product.tipoProducto === 'EQUIPO') {
      const available = product.stock ?? 0;
      if (available < item.cantidad) {
        throw new Error(`STOCK INSUFICIENTE: ${product.nombre} (disponible: ${available})`);
      }
    }
  }
};

const validateExclusivas = async (items) => {
  for (const item of items) {
    if (item.licenciaId === null) continue;
    const product = await db.findById('products', item.productoId);
    if (!product || !product.licencias) continue;
    const target = product.licencias.find((l) => l.id === item.licenciaId);
    if (target && target.nombre === 'EXCLUSIVA' && target.vendida) {
      throw new Error('LICENCIA EXCLUSIVA YA VENDIDA');
    }
  }
};

const persistOrder = async (body) => {
  const order = await db.create('orders', {
    compradorId: body.compradorId,
    montoTotal: body.montoTotal,
    items: body.items,
    estadoOrden: 'PAGADA',
  });

  for (const item of body.items) {
    const product = await db.findById('products', item.productoId);
    if (!product) continue;

    if (product.tipoProducto === 'EQUIPO') {
      const newStock = (product.stock ?? 0) - item.cantidad;
      await db.update('products', product.id, { stock: newStock });
      continue;
    }

    if (item.licenciaId === null || !product.licencias) continue;
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
  await validateStock(body.items);
  await validateExclusivas(body.items);

  await transport(body);

  const order = await persistOrder(body);
  return {
    orderId: order.id,
    estadoOrden: order.estadoOrden,
    montoTotal: order.montoTotal,
  };
};