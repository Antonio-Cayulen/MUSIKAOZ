import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const defaultProps = {
    nombre: 'Trap Beat Midnight',
    precio: 29.99,
    imagenUrl: 'https://placehold.co/600x600',
    tipoProducto: 'BEAT',
  };

  it('muestra el nombre y el precio formateado', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.getByText('Trap Beat Midnight')).toBeTruthy();
    expect(screen.getByText('$29.99')).toBeTruthy();
  });

  it('muestra el badge OFERTA cuando isOffer es true', () => {
    render(<ProductCard {...defaultProps} isOffer={true} />);
    expect(screen.getByText('OFERTA')).toBeTruthy();
  });

  it('no muestra el badge OFERTA cuando isOffer está ausente', () => {
    render(<ProductCard {...defaultProps} />);
    expect(screen.queryByText('OFERTA')).toBeNull();
  });
  
  it('llama a onAddToCart al hacer clic en AÑADIR AL CARRITO', () => {
    const spy = jasmine.createSpy('onAddToCart');
    render(<ProductCard {...defaultProps} onAddToCart={spy} />);
    screen.getByText('AÑADIR AL CARRITO').click();
  expect(spy).toHaveBeenCalledTimes(1);
});
});
