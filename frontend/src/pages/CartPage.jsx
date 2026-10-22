import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { items, removeItem, total } = useCart();

  return (
    <main className="cart-page">
      <header className="cart-page__header">
        <h1 className="cart-page__title">CARRITO</h1>
      </header>

      {items.length === 0 ? (
        <p className="cart-page__empty">Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="cart-page__items">
            {items.map((item) => (
              <li className="cart-page__item" key={item.id}>
                <span className="cart-page__item-name">{item.nombre}</span>
                <span className="cart-page__item-qty">
                  x{item.cantidad}
                </span>
                <span className="cart-page__item-price">
                  ${(item.precioBase * item.cantidad).toFixed(2)}
                </span>
                <button
                  className="cart-page__remove"
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  QUITAR
                </button>
              </li>
            ))}
          </ul>

          <footer className="cart-page__footer">
            <span className="cart-page__total-label">TOTAL</span>
            <span className="cart-page__total">${total.toFixed(2)}</span>
          </footer>
        </>
      )}
    </main>
  );
};

export default CartPage;