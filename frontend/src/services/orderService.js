const SIMULATED_LATENCY_MS = 400;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let transport = async (body) => {
  await delay(SIMULATED_LATENCY_MS);
  return {
    orderId: 100,
    estadoOrden: 'PAGADA',
    montoTotal: body.montoTotal,
  };
};

export const __setOrderTransport = (next) => {
  transport = next;
};

export const __resetOrderTransport = () => {
  transport = async (body) => {
    await delay(SIMULATED_LATENCY_MS);
    return {
      orderId: 100,
      estadoOrden: 'PAGADA',
      montoTotal: body.montoTotal,
    };
  };
};

export const createOrder = (body) => transport(body);