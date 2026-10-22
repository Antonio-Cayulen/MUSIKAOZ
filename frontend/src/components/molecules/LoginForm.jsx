import { useState } from 'react';
import { isValidEmail, isValidPassword, useAuth } from '../../context/AuthContext';
import './LoginForm.css';

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!isValidEmail(email)) {
      next.email = 'CORREO INVÁLIDO — USA @duoc.cl, @profesor.duoc.cl O @gmail.com';
    }
    if (!isValidPassword(password)) {
      next.password = 'CONTRASEÑA DEBE TENER ENTRE 4 Y 10 CARACTERES';
    }
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const result = login({ email, password });
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    onSuccess?.();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__panel">
        <header className="login-form__header">
          <span className="login-form__eyebrow">ACCESO</span>
          <h1 className="login-form__title">INICIAR SESIÓN</h1>
        </header>

        <div className="login-form__field">
          <label className="login-form__label" htmlFor="login-email">
            CORREO
          </label>
          <input
            id="login-email"
            className={`login-form__input${
              errors.email ? ' login-form__input--error' : ''
            }`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && (
            <span className="login-form__error">{errors.email}</span>
          )}
        </div>

        <div className="login-form__field">
          <label className="login-form__label" htmlFor="login-password">
            CONTRASEÑA
          </label>
          <input
            id="login-password"
            className={`login-form__input${
              errors.password ? ' login-form__input--error' : ''
            }`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && (
            <span className="login-form__error">{errors.password}</span>
          )}
        </div>

        {errors.form && <p className="login-form__form-error">{errors.form}</p>}

        <button className="login-form__submit" type="submit">
          ENTRAR
        </button>

        <div className="login-form__status">
          <span className="login-form__status-dot" aria-hidden="true" />
          <span>AUTH SYSTEM ONLINE</span>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;