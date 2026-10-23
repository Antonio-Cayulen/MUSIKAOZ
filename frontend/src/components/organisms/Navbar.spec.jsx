import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
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
  beforeEach(() => {
    localStorage.clear();
  });

  it('oculta el link ADMIN cuando el rol es USER', () => {
    localStorage.setItem(
      'marketplace.auth',
      JSON.stringify({ id: 2, name: 'user', role: 'USER' })
    );

    renderNavbar();

    expect(screen.queryByText('ADMIN')).toBeNull();
  });

  it('muestra el link ADMIN cuando el rol es ADMIN', () => {
    localStorage.setItem(
      'marketplace.auth',
      JSON.stringify({ id: 1, name: 'admin', role: 'ADMIN' })
    );

    renderNavbar();

    expect(screen.getByText('ADMIN')).toBeTruthy();
  });
});