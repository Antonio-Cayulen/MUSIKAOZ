import { useEffect, useState } from 'react';
import SearchBar from '../components/organisms/SearchBar';
import ProductGrid from '../components/organisms/ProductGrid';
import { getActiveProducts, getMarketStatus } from '../services/productService';
import { useCart } from '../context/CartContext';
import './CatalogPage.css';

const INITIAL_FILTERS = { text: '', tipo: 'TODOS', estado: 'TODOS' };

const filterProducts = (products, filters) => {
  const text = filters.text.trim().toLowerCase();
  return products.filter((product) => {
    if (text && !product.nombre.toLowerCase().includes(text)) return false;
    if (filters.tipo !== 'TODOS' && product.tipoProducto !== filters.tipo) {
      return false;
    }
    if (
      filters.estado !== 'TODOS' &&
      getMarketStatus(product) !== filters.estado
    ) {
      return false;
    }
    return true;
  });
};

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('LOADING');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
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

  const handleClearFilters = () => setFilters(INITIAL_FILTERS);

  const visibleProducts = filterProducts(products, filters);

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
        <>
          <SearchBar
            filters={filters}
            onChange={setFilters}
            onClear={handleClearFilters}
          />

          {visibleProducts.length === 0 ? (
            <div className="catalog-page__empty">
              <p className="catalog-page__empty-text">SIN RESULTADOS</p>
              <button
                className="catalog-page__empty-clear"
                type="button"
                onClick={handleClearFilters}
              >
                LIMPIAR FILTROS
              </button>
            </div>
          ) : (
            <ProductGrid
              products={visibleProducts}
              onAddToCart={handleAddToCart}
            />
          )}
        </>
      )}
    </main>
  );
};

export default CatalogPage;