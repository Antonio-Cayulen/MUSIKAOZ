import { Routes, Route } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
