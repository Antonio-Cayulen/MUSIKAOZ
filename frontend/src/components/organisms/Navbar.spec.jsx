import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { resetDatabase } from '../../data/db.js';
import Navbar from './Navbar';

const renderNavbar = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
  });

  it('oculta el link ADMIN cuando el rol es USER', () => {
    localStorage.setItem(
      'marketplace.auth',
      JSON.stringify({ id: 3, name: 'buyer', email: 'buyer@gmail.com', role: 'USER' })
    );

    renderNavbar();

    expect(screen.queryByText('ADMIN')).toBeNull();
  });

  it('muestra el link ADMIN cuando el rol es ADMIN', () => {
    localStorage.setItem(
      'marketplace.auth',
      JSON.stringify({ id: 1, name: 'admin', email: 'admin@duoc.cl', role: 'ADMIN' })
    );

    renderNavbar();

    expect(screen.getByText('ADMIN')).toBeTruthy();
  });
});