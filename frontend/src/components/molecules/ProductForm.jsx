import { useEffect, useState } from 'react';
import './ProductForm.css';

const EMPTY = {
  nombre: '',
  precioBase: '',
  stock: '',
  tipoProducto: 'BEAT',
  imagenUrl: '',
};

const ProductForm = ({ initialValues, onSubmit, submitLabel = 'CREAR PRODUCTO' }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setForm({
        nombre: initialValues.nombre ?? '',
        precioBase: String(initialValues.precioBase ?? ''),
        stock: String(initialValues.stock ?? ''),
        tipoProducto: initialValues.tipoProducto ?? 'BEAT',
        imagenUrl: initialValues.imagenUrl ?? '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const next = {};
    const precio = Number(form.precioBase);
    const stock = Number(form.stock);

    if (!form.nombre.trim()) next.nombre = 'NOMBRE REQUERIDO';
    if (form.precioBase === '' || Number.isNaN(precio) || precio < 0) {
      next.precioBase = 'PRECIO DEBE SER MAYOR O IGUAL A 0';
    }
    if (form.stock === '' || Number.isNaN(stock) || stock < 0) {
      next.stock = 'STOCK DEBE SER MAYOR O IGUAL A 0';
    }
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit?.({
      nombre: form.nombre.trim(),
      precioBase: Number(form.precioBase),
      stock: Number(form.stock),
      tipoProducto: form.tipoProducto,
      imagenUrl: form.imagenUrl.trim(),
      estado: 'ACTIVO',
    });
    if (!initialValues) setForm(EMPTY);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <header className="product-form__header">
        <span className="product-form__eyebrow">
          {initialValues ? 'EDITAR' : 'NUEVO'}
        </span>
        <h2 className="product-form__title">
          {initialValues ? 'EDITAR PRODUCTO' : 'ALTA DE PRODUCTO'}
        </h2>
      </header>

      <div className="product-form__field">
        <label className="product-form__label" htmlFor="pf-nombre">NOMBRE</label>
        <input
          id="pf-nombre"
          name="nombre"
          className={`product-form__input${errors.nombre ? ' product-form__input--error' : ''}`}
          value={form.nombre}
          onChange={handleChange}
          type="text"
        />
        {errors.nombre && <span className="product-form__error">{errors.nombre}</span>}
      </div>

      <div className="product-form__row">
        <div className="product-form__field">
          <label className="product-form__label" htmlFor="pf-precio">PRECIO BASE</label>
          <input
            id="pf-precio"
            name="precioBase"
            className={`product-form__input${errors.precioBase ? ' product-form__input--error' : ''}`}
            value={form.precioBase}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
          />
          {errors.precioBase && <span className="product-form__error">{errors.precioBase}</span>}
        </div>

        <div className="product-form__field">
          <label className="product-form__label" htmlFor="pf-stock">STOCK</label>
          <input
            id="pf-stock"
            name="stock"
            className={`product-form__input${errors.stock ? ' product-form__input--error' : ''}`}
            value={form.stock}
            onChange={handleChange}
            type="number"
            min="0"
            step="1"
          />
          {errors.stock && <span className="product-form__error">{errors.stock}</span>}
        </div>
      </div>

      <div className="product-form__field">
        <label className="product-form__label" htmlFor="pf-tipo">TIPO</label>
        <select
          id="pf-tipo"
          name="tipoProducto"
          className="product-form__input"
          value={form.tipoProducto}
          onChange={handleChange}
          disabled={Boolean(initialValues)}
        >
          <option value="BEAT">BEAT</option>
          <option value="EQUIPO">EQUIPO</option>
        </select>
      </div>

      <div className="product-form__field">
        <label className="product-form__label" htmlFor="pf-imagen">URL IMAGEN</label>
        <input
          id="pf-imagen"
          name="imagenUrl"
          className="product-form__input"
          value={form.imagenUrl}
          onChange={handleChange}
          type="url"
        />
      </div>

      <button className="product-form__submit" type="submit">
        {submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;