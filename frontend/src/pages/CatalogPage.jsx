import { useEffect, useState } from 'react';
import ProductGrid from '../components/organisms/ProductGrid';
import { getActiveProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import './CatalogPage.css';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('LOADING');
  const { addItem } = useCart();

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

  const handleAddToCart = (product) => {
    if (product.tipoProducto === 'BEAT') {
      // Requiere ProductDetail con selección explícita de licencia (pendiente).
      return;
    }
    addItem({
      productoId: product.id,
      nombre: product.nombre,
      tipoProducto: product.tipoProducto,
      precioUnitario: product.precioBase,
      licenciaId: null,
      licenciaNombre: null,
      imagenUrl: product.imagenUrl,
      cantidad: 1,
    });
  };

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
        <ProductGrid products={products} onAddToCart={handleAddToCart} />
      )}
    </main>
  );
};

export default CatalogPage;
