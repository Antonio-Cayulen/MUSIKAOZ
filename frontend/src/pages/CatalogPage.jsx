import { useEffect, useState } from 'react';
import { getActiveProducts } from '../services/productService';
import './CatalogPage.css';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('LOADING'); // LOADING | READY | ERROR

  useEffect(() => {
    let isMounted = true;

    getActiveProducts()
      .then((data) => {
        if (!isMounted) return;
        setProducts(data);
        setStatus('READY');
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus('ERROR');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="catalog-page">
      <h1 className="catalog-page__title">MARKETPLACE</h1>

      {status === 'LOADING' && (
        <p className="catalog-page__status">CARGANDO CATÁLOGO...</p>
      )}

      {status === 'ERROR' && (
        <p className="catalog-page__status catalog-page__status--error">
          ERROR AL CARGAR EL CATÁLOGO
        </p>
      )}

      {status === 'READY' && (
        <ul className="catalog-page__grid">
          {products.map((product) => (
            <li className="catalog-page__item" key={product.id}>
              <span className="catalog-page__item-name">{product.nombre}</span>
              <span className="catalog-page__item-price">
                ${product.precioBase.toFixed(2)}
              </span>
              <span className="catalog-page__item-type">
                {product.tipoProducto}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default CatalogPage;
