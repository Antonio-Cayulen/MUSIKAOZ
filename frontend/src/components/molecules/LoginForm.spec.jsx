import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import LoginForm from './LoginForm';

const renderForm = (props = {}) =>
  render(
    <AuthProvider>
      <LoginForm {...props} />
    </AuthProvider>
  );

const fillAndSubmit = (email, password) => {
  fireEvent.change(document.getElementById('login-email'), {
    target: { value: email },
  });
  fireEvent.change(document.getElementById('login-password'), {
    target: { value: password },
  });

  fireEvent.submit(document.querySelector('form.login-form'));
};

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bloquea el envío con correo que no termina en dominio permitido', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    fillAndSubmit('user@hotmail.com', '1234');

    expect(await screen.findByText(/CORREO INVÁLIDO/i)).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('bloquea el envío si la contraseña tiene menos de 4 caracteres', async () => {
    const onSuccess = jasmine.createSpy('onSuccess');
    renderForm({ onSuccess });

    fillAndSubmit('user@gmail.com', '12');

    expect(
      await screen.findByText(/ENTRE 4 Y 10 CARACTERES/i)
    ).toBeTruthy();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});