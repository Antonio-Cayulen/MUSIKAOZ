import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../context/AuthContext';
import { resetDatabase } from '../../data/db.js';
import LoginForm from './LoginForm';

const renderForm = (props = {}) =>
  render(
    <AuthProvider>
      <LoginForm {...props} />
    </AuthProvider>
  );

const fillAndSubmit = async (email, password) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/correo/i), email);
  await user.type(screen.getByLabelText(/contraseña/i), password);
  await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
};

describe('LoginForm', () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetDatabase();
  });

  it('bloquea el envío con correo que no termina en dominio permitido', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('user@hotmail.com', '1234');

    expect(await screen.findByText(/CORREO INVÁLIDO/i)).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('bloquea el envío si la contraseña tiene menos de 4 caracteres', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('buyer@gmail.com', '12');

    expect(await screen.findByText(/ENTRE 4 Y 10 CARACTERES/i)).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('rechaza credenciales correctas en formato pero inexistentes en db', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('nadie@gmail.com', '1234');

    expect(
      await screen.findByText(/USUARIO O CONTRASEÑA INCORRECTOS/i)
    ).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('acepta login con credenciales seedeadas y llama a onSuccess', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    await fillAndSubmit('buyer@gmail.com', 'buyer123');

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });
});