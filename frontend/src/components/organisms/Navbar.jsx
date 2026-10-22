// frontend/src/components/molecules/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link className="navbar__brand" to="/">
        MARKET<span className="navbar__brand-accent">/</span>PLACE
      </Link>

      <ul className="navbar__links">
        <li>
          <Link className="navbar__link" to="/">
            CATÁLOGO
          </Link>
        </li>
        <li>
          <Link className="navbar__link" to="/cart">
            CARRITO<span className="navbar__count">[{items.length}]</span>
          </Link>
        </li>
        {user?.role === 'ADMIN' && (
          <li>
            <Link className="navbar__link navbar__link--admin" to="/admin">
              ADMIN
            </Link>
          </li>
        )}
      </ul>

      <div className="navbar__session">
        {user ? (
          <>
            <span className="navbar__user">{user.name}</span>
            <button
              className="navbar__logout"
              type="button"
              onClick={handleLogout}
            >
              SALIR
            </button>
          </>
        ) : (
          <Link className="navbar__login" to="/login">
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;