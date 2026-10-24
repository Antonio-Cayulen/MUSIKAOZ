import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../context/AuthContext';
import { resetDatabase, db } from '../data/db';
import AdminPage from './AdminPage';

const renderAdmin = () =>
  render(
    <AuthProvider>
      <AdminPage />
    </AuthProvider>
  );

describe('AdminPage', () => {
  let user;

  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
    user = userEvent.setup();
  });

  it('no muestra acción de editar sobre un beat RETIRADO', async () => {
    await db.update('products', 1, {
      licencias: [
        { id: 11, nombre: 'NO_EXCLUSIVA', precio: 29.99, vendida: false },
        { id: 12, nombre: 'EXCLUSIVA',       precio: 199.99, vendida: true },
      ],
    });

    renderAdmin();
    await screen.findByText('Trap Beat Midnight');

    const row = screen.getByText('Trap Beat Midnight').closest('li');

    expect(within(row).queryByRole('button', { name: /editar/i })).toBeNull();
    expect(within(row).getByText(/RETIRADO/i)).toBeTruthy();
  });
});