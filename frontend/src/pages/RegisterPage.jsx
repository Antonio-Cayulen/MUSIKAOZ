import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/organisms/RegisterForm';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <main className="register-page">
      <div className="register-page__decor" aria-hidden="true" />
      <div className="register-page__stack">
        <RegisterForm onSuccess={() => navigate('/')} />
        <Link className="register-page__link" to="/login">
          ¿YA TIENES CUENTA? INICIA SESIÓN
        </Link>
      </div>
    </main>
  );
};

export default RegisterPage;