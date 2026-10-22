import './ProductCard.css';

const ProductCard = ({
  nombre,
  precio,
  imagenUrl,
  tipoProducto,
  isOffer = false,
  onAddToCart,
}) => {
  const priceClassName = `product-card__price${
    isOffer ? ' product-card__price--offer' : ''
  }`;

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
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">{nombre}</h3>
        <span className="product-card__type">{tipoProducto}</span>
        <span className={priceClassName}>${Number(precio).toFixed(2)}</span>
      </div>

      <button
        className="product-card__action"
        type="button"
        onClick={() => onAddToCart?.()}
      >
        AÑADIR AL CARRITO
      </button>
    </article>
  );
};

export default ProductCard;
