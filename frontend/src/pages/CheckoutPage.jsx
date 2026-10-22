import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [status, setStatus] = useState('IDLE'); // IDLE | SUBMITTING | SUCCESS | ERROR
  const [order, setOrder] = useState(null);

  if (!user) return <Navigate to="/login" replace />;

  const handleConfirm = async () => {
    setStatus('SUBMITTING');
    try {
      const body = {
        compradorId: user.id,
        montoTotal: total,
        items: items.map((item) => ({
          productoId: item.productoId,
          licenciaId: item.licenciaId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          nombreSnapshot: item.nombreSnapshot,
        })),
      };
      const result = await createOrder(body);
      setOrder(result);
      setStatus('SUCCESS');
      clearCart();
    } catch {
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS' && order) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__confirmation">
          <h1 className="checkout-page__title">ORDEN CONFIRMADA</h1>
          <dl className="checkout-page__receipt">
            <dt>ORDEN</dt>
            <dd>#{order.orderId}</dd>
            <dt>ESTADO</dt>
            <dd>{order.estadoOrden}</dd>
            <dt>TOTAL</dt>
            <dd>${order.montoTotal.toFixed(2)}</dd>
          </dl>
          <Link className="checkout-page__back" to="/">
            VOLVER AL CATÁLOGO
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <p className="checkout-page__empty">Tu carrito está vacío</p>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-page__title">CHECKOUT</h1>

      <ul className="checkout-page__items">
        {items.map((item) => (
          <li className="checkout-page__item" key={item.key}>
            <span className="checkout-page__item-name">{item.nombreSnapshot}</span>
            <span className="checkout-page__item-qty">x{item.cantidad}</span>
            <span className="checkout-page__item-price">
              ${(item.precioUnitario * item.cantidad).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <footer className="checkout-page__footer">
        <span className="checkout-page__total-label">TOTAL</span>
        <span className="checkout-page__total">${total.toFixed(2)}</span>
      </footer>

      <button
        className="checkout-page__confirm"
        type="button"
        onClick={handleConfirm}
        disabled={status === 'SUBMITTING'}
      >
        {status === 'SUBMITTING' ? 'PROCESANDO...' : 'CONFIRMAR ORDEN'}
      </button>

      {status === 'ERROR' && (
        <p className="checkout-page__error">ERROR AL CREAR LA ORDEN</p>
      )}
    </main>
  );
};

export default CheckoutPage;