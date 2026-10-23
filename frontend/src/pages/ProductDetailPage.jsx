import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('LOADING');
  const [licenciaId, setLicenciaId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setStatus('LOADING');
    getProductById(id).then((data) => {
      if (!isMounted) return;
      if (!data || data.estado !== 'ACTIVO') {
        setStatus('NOT_FOUND');
        return;
      }
      setProduct(data);
      if (data.tipoProducto === 'BEAT' && data.licencias?.length) {
        const firstAvailable = data.licencias.find((l) => !l.vendida);
        setLicenciaId(firstAvailable ? firstAvailable.id : null);
      }
      setStatus('READY');
    });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (status === 'LOADING') {
    return (
      <main className="product-detail">
        <p className="product-detail__status">CARGANDO...</p>
      </main>
    );
  }

  if (status === 'NOT_FOUND') {
    return (
      <main className="product-detail">
        <p className="product-detail__status product-detail__status--error">
          PRODUCTO NO ENCONTRADO
        </p>
      </main>
    );
  }

  const isBeat = product.tipoProducto === 'BEAT';
  const selectedLicencia = isBeat
    ? product.licencias.find((l) => l.id === licenciaId)
    : null;
  const unitPrice = selectedLicencia ? selectedLicencia.precio : product.precioBase;
  const canAdd = !isBeat || (selectedLicencia && !selectedLicencia.vendida);

  const handleAdd = () => {
    if (!canAdd) {
      setError('LICENCIA NO DISPONIBLE');
      return;
    }
    setError('');
    addItem({
      productoId: product.id,
      nombre: product.nombre,
      tipoProducto: product.tipoProducto,
      precioUnitario: unitPrice,
      licenciaId: selectedLicencia ? selectedLicencia.id : null,
      licenciaNombre: selectedLicencia ? selectedLicencia.nombre : null,
      imagenUrl: product.imagenUrl,
      cantidad: 1,
    });
    navigate('/cart');
  };

  return (
    <main className="product-detail">
      <div className="product-detail__media">
        <img
          className="product-detail__image"
          src={product.imagenUrl}
          alt={product.nombre}
        />
      </div>

      <div className="product-detail__info">
        <span className="product-detail__type">{product.tipoProducto}</span>
        <h1 className="product-detail__title">{product.nombre}</h1>

        {isBeat && (
          <fieldset className="product-detail__licencias">
            <legend className="product-detail__legend">SELECCIONA LICENCIA</legend>
            {product.licencias.map((licencia) => {
              const disabled = licencia.vendida;
              const active = licencia.id === licenciaId;
              return (
                <label
                  className={`product-detail__licencia${
                    active ? ' product-detail__licencia--active' : ''
                  }${disabled ? ' product-detail__licencia--disabled' : ''}`}
                  key={licencia.id}
                >
                  <input
                    type="radio"
                    name="licencia"
                    value={licencia.id}
                    checked={active}
                    disabled={disabled}
                    onChange={() => setLicenciaId(licencia.id)}
                  />
                  <span className="product-detail__licencia-name">
                    {licencia.nombre}
                    {disabled && ' — VENDIDA'}
                  </span>
                  <span className="product-detail__licencia-price">
                    ${licencia.precio.toFixed(2)}
                  </span>
                </label>
              );
            })}
          </fieldset>
        )}

        <span className="product-detail__price">${unitPrice.toFixed(2)}</span>

        <button
          className="product-detail__add"
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
        >
          AÑADIR AL CARRITO
        </button>

        {error && <p className="product-detail__error">{error}</p>}
      </div>
    </main>
  );
};

export default ProductDetailPage;