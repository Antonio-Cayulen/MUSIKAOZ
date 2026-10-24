import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/organisms/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <div className="login-page__decor" aria-hidden="true" />
      <div className="login-page__stack">
        <LoginForm onSuccess={() => navigate('/')} />
        <Link className="login-page__link" to="/register">
          ¿NUEVO? CREA UNA CUENTA
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;