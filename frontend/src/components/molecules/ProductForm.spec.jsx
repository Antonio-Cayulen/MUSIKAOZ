import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from './ProductForm';

const renderForm = (props = {}) => render(<ProductForm {...props} />);

const fillAndSubmit = ({ nombre, precioBase, stock, tipoProducto, imagenUrl }) => {
  if (nombre !== undefined)
    fireEvent.change(document.getElementById('pf-nombre'), { target: { value: nombre } });
  if (precioBase !== undefined)
    fireEvent.change(document.getElementById('pf-precio'), { target: { value: String(precioBase) } });
  if (stock !== undefined)
    fireEvent.change(document.getElementById('pf-stock'), { target: { value: String(stock) } });
  if (tipoProducto !== undefined)
    fireEvent.change(document.getElementById('pf-tipo'), { target: { value: tipoProducto } });
  if (imagenUrl !== undefined)
    fireEvent.change(document.getElementById('pf-imagen'), { target: { value: imagenUrl } });

  fireEvent.submit(document.querySelector('form.product-form'));
};

describe('ProductForm', () => {
  it('bloquea el envío si el precio es negativo', async () => {
    const onSubmit = jasmine.createSpy('onSubmit');
    renderForm({ onSubmit });

    fillAndSubmit({
      nombre: 'Beat X',
      precioBase: -100,
      stock: 5,
      tipoProducto: 'BEAT',
      imagenUrl: 'https://example.com/x.jpg',
    });

    expect(await screen.findByText(/PRECIO DEBE SER MAYOR O IGUAL A 0/i)).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});