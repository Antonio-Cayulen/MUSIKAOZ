const SIMULATED_LATENCY_MS = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const createOrder = async ({ compradorId, montoTotal, items }) => {
  await delay(SIMULATED_LATENCY_MS);
  // Mock del contrato POST /api/orders. Traduce snake_case del backend a camelCase interno.
  return {
    orderId: 100,
    estadoOrden: 'PAGADA',
    montoTotal,
    _request: { compradorId, montoTotal, items },
  };
};