import { useEffect, useState } from 'react';
import ProductForm from '../components/molecules/ProductForm';
import { getProducts } from '../services/productService';
import './AdminPage.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getProducts().then((data) => {
      if (isMounted) setProducts(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = (product) => {
    setProducts((current) => [
      { ...product, id: Math.max(0, ...current.map((p) => p.id)) + 1 },
      ...current,
    ]);
  };

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">PANEL ADMIN</h1>
        <span className="admin-page__hint">
          {products.length} PRODUCTO(S) REGISTRADO(S)
        </span>
      </header>

      <div className="admin-page__layout">
        <ProductForm onSubmit={handleCreate} />

        <section className="admin-page__list">
          <h2 className="admin-page__subtitle">INVENTARIO</h2>
          <ul className="admin-page__items">
            {products.map((product) => (
              <li className="admin-page__item" key={product.id}>
                <span className="admin-page__item-name">{product.nombre}</span>
                <span className="admin-page__item-type">
                  {product.tipoProducto}
                </span>
                <span className="admin-page__item-price">
                  ${Number(product.precioBase).toFixed(2)}
                </span>
                <span
                  className={`admin-page__item-state${
                    product.estado === 'ACTIVO'
                      ? ''
                      : ' admin-page__item-state--off'
                  }`}
                >
                  {product.estado}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;