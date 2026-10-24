import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({
  nombre,
  precio,
  imagenUrl,
  tipoProducto,
  isOffer = false,
  detailsHref = null,
  commercable = true,
  onAddToCart,
}) => {
  const priceClassName = `product-card__price${
    isOffer ? ' product-card__price--offer' : ''
  }`;
  const showDetails = Boolean(detailsHref);

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img
          className="product-card__image"
          src={imagenUrl}
          alt={nombre}
          loading="lazy"
        />
        {isOffer && <span className="product-card__badge">OFERTA</span>}
        {!commercable && (
          <span className="product-card__badge product-card__badge--off">
            NO DISPONIBLE
          </span>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{nombre}</h3>
        <span className="product-card__type">{tipoProducto}</span>
        <span className={priceClassName}>${Number(precio).toFixed(2)}</span>
      </div>

      {showDetails ? (
        <Link className="product-card__action" to={detailsHref}>
          VER LICENCIAS
        </Link>
      ) : commercable ? (
        <button
          className="product-card__action"
          type="button"
          onClick={() => onAddToCart?.()}
        >
          AÑADIR AL CARRITO
        </button>
      ) : (
        <span className="product-card__action product-card__action--disabled">
          NO DISPONIBLE
        </span>
      )}
    </article>
  );
};

export default ProductCard;