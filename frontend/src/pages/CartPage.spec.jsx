import { render, screen } from '@testing-library/react';
import { CartProvider } from '../context/CartContext';
import CartPage from './CartPage';

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra "Tu carrito está vacío" cuando no hay items', () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );

    expect(screen.getByText('Tu carrito está vacío')).toBeTruthy();
  });
});