import ProductCard from '../atoms/ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          nombre={product.nombre}
          precio={product.precioBase}
          imagenUrl={product.imagenUrl}
          tipoProducto={product.tipoProducto}
          isOffer={product.isOffer ?? false}
          onAddToCart={() => onAddToCart?.(product)}
        />
      ))}
    </section>
  );
};

export default ProductGrid;
