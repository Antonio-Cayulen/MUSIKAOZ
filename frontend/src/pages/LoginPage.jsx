import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/molecules/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <main className="login-page">
      <div className="login-page__decor" aria-hidden="true" />
      <LoginForm onSuccess={() => navigate('/')} />
    </main>
  );
};

export default LoginPage;