import { useState } from 'react';
import {
  isValidEmail,
  isValidPassword,
  useAuth,
} from '../../context/AuthContext';
import './RegisterForm.css';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!isValidEmail(email)) {
      next.email =
        'CORREO INVÁLIDO — USA @duoc.cl, @profesor.duoc.cl O @gmail.com';
    }
    if (!isValidPassword(password)) {
      next.password = 'CONTRASEÑA DEBE TENER ENTRE 4 Y 10 CARACTERES';
    }
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = await register({ email, password });
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    onSuccess?.();
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <div className="register-form__panel">
        <header className="register-form__header">
          <span className="register-form__eyebrow">REGISTRO</span>
          <h1 className="register-form__title">CREAR CUENTA</h1>
        </header>

        <div className="register-form__field">
          <label className="register-form__label" htmlFor="register-email">
            CORREO
          </label>
          <input
            id="register-email"
            className={`register-form__input${
              errors.email ? ' register-form__input--error' : ''
            }`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && (
            <span className="register-form__error">{errors.email}</span>
          )}
        </div>

        <div className="register-form__field">
          <label className="register-form__label" htmlFor="register-password">
            CONTRASEÑA
          </label>
          <input
            id="register-password"
            className={`register-form__input${
              errors.password ? ' register-form__input--error' : ''
            }`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="register-form__error">{errors.password}</span>
          )}
        </div>

        {errors.form && (
          <p className="register-form__form-error">{errors.form}</p>
        )}

        <button
          className="register-form__submit"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'CREANDO CUENTA...' : 'REGISTRARSE'}
        </button>

        <div className="register-form__status">
          <span className="register-form__status-dot" aria-hidden="true" />
          <span>NEW ACCOUNT PROTOCOL</span>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;