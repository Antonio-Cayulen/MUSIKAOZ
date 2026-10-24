import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../context/AuthContext';
import { resetDatabase, db } from '../../data/db';
import RegisterForm from './RegisterForm';

const renderForm = (props = {}) =>
  render(
    <AuthProvider>
      <RegisterForm {...props} />
    </AuthProvider>
  );

const fillAndSubmit = async (email, password) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/correo/i), email);
  await user.type(screen.getByLabelText(/contraseña/i), password);
  await user.click(screen.getByRole('button', { name: /registrarse/i }));
};

describe('RegisterForm', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
  });

  it('crea un usuario USER y llama a onSuccess con datos válidos', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('nuevo@gmail.com', 'nuevo123');

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    const users = await db.list('users');
    const created = users.find((u) => u.email === 'nuevo@gmail.com');
    expect(created).toBeTruthy();
    expect(created.role).toBe('USER');

    const storedAuth = JSON.parse(localStorage.getItem('marketplace.auth'));
    expect(storedAuth.email).toBe('nuevo@gmail.com');
    expect(storedAuth.role).toBe('USER');
  });

  it('rechaza email ya registrado', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('buyer@gmail.com', 'buyer123');

    expect(
      await screen.findByText(/EMAIL YA REGISTRADO/i)
    ).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('bloquea registro con dominio no permitido', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('nuevo@hotmail.com', 'nuevo123');

    expect(await screen.findByText(/CORREO INVÁLIDO/i)).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});