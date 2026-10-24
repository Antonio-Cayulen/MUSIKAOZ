import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, getMarketStatus } from '../services/productService';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const BANNER_TEXT = {
  RETIRADO: 'ESTE BEAT YA FUE VENDIDO EN EXCLUSIVA',
  INACTIVO: 'PRODUCTO INACTIVO — NO DISPONIBLE PARA COMPRA',
  AGOTADO: 'PRODUCTO AGOTADO — SIN STOCK DISPONIBLE',
};

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
      if (!data) {
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
  const marketStatus = getMarketStatus(product);
  const selectedLicencia = isBeat
    ? product.licencias.find((l) => l.id === licenciaId)
    : null;
  const unitPrice = selectedLicencia ? selectedLicencia.precio : product.precioBase;
  const canAdd = marketStatus === 'DISPONIBLE';

  const handleAdd = () => {
    if (!canAdd) {
      setError('PRODUCTO NO DISPONIBLE');
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
      marketStatus,
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

        {marketStatus !== 'DISPONIBLE' && (
          <p className="product-detail__banner">{BANNER_TEXT[marketStatus]}</p>
        )}

        {isBeat && (
          <fieldset className="product-detail__licencias">
            <legend className="product-detail__legend">SELECCIONA LICENCIA</legend>
            {product.licencias.map((licencia) => {
              const disabled = licencia.vendida || !canAdd;
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
                    {licencia.vendida && ' — VENDIDA'}
                  </span>
                  <span className="product-detail__licencia-price">
                    ${licencia.precio.toFixed(2)}
                  </span>
                </label>
              );
            })}
          </fieldset>
        )}

        {!isBeat && (
          <span className="product-detail__stock">
            STOCK DISPONIBLE: {product.stock ?? 0}
          </span>
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