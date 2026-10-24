import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { resetDatabase } from '../data/db';
import CatalogPage from './CatalogPage';

const renderCatalog = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <CatalogPage />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('CatalogPage filtros', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
  });

  it('filtra por texto y muestra SIN RESULTADOS cuando no hay coincidencias', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await screen.findByText('Trap Beat Midnight');

    await user.type(screen.getByLabelText(/buscar/i), 'zzzzz-no-existe');

    expect(await screen.findByText('SIN RESULTADOS')).toBeTruthy();
    expect(screen.queryByText('Trap Beat Midnight')).toBeNull();
    expect(screen.queryByText('Micrófono Condensador')).toBeNull();
  });

  it('filtra por tipo EQUIPO y excluye beats', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await screen.findByText('Trap Beat Midnight');

    await user.selectOptions(screen.getByLabelText(/tipo/i), 'EQUIPO');

    expect(await screen.findByText('Micrófono Condensador')).toBeTruthy();
    expect(screen.queryByText('Trap Beat Midnight')).toBeNull();
    expect(screen.queryByText('Boom Bap Beat Relic')).toBeNull();
  });
});