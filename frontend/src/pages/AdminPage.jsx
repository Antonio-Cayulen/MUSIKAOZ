import { useEffect, useState } from 'react';
import ProductForm from '../components/molecules/ProductForm';
import {
  getProducts,
  getMarketStatus,
  createProduct,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
} from '../services/productService';
import './AdminPage.css';

const STATUS_LABEL = {
  DISPONIBLE: 'DISPONIBLE',
  RETIRADO: 'RETIRADO',
  INACTIVO: 'INACTIVO',
  AGOTADO: 'AGOTADO (SIN STOCK)',
};

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (payload) => {
    await createProduct(payload);
    setEditing(null);
    await refresh();
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    await updateProduct(editing.id, {
      nombre: payload.nombre,
      precioBase: payload.precioBase,
      stock: payload.stock,
      imagenUrl: payload.imagenUrl,
      tipoProducto: payload.tipoProducto,
    });
    setEditing(null);
    await refresh();
  };

  const handleSoftDelete = async (id) => {
    await softDeleteProduct(id);
    await refresh();
  };

  const handleRestore = async (id) => {
    await restoreProduct(id);
    await refresh();
  };

  const startEdit = (product) => {
    if (getMarketStatus(product) === 'RETIRADO') return;
    setEditing(product);
  };

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">PANEL ADMIN</h1>
        <span className="admin-page__hint">
          {products.length} PRODUCTO(S) REGISTRADO(S)
        </span>
      </header>

      <div className="admin-page__layout">
        <div>
          <ProductForm
            key={editing?.id ?? 'new'}
            initialValues={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            submitLabel={editing ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
          />
          {editing && (
            <button
              className="admin-page__cancel"
              type="button"
              onClick={() => setEditing(null)}
            >
              CANCELAR EDICIÓN
            </button>
          )}
        </div>

        <section className="admin-page__list">
          <h2 className="admin-page__subtitle">INVENTARIO</h2>
          <ul className="admin-page__items">
            {products.map((product) => {
              const status = getMarketStatus(product);
              const canEdit = status !== 'RETIRADO';
              const canDeactivate = status === 'DISPONIBLE';
              const canRestore = status === 'INACTIVO';
              return (
                <li className="admin-page__item" key={product.id}>
                  <span className="admin-page__item-name">{product.nombre}</span>
                  <span className="admin-page__item-type">
                    {product.tipoProducto}
                  </span>
                  <span className="admin-page__item-price">
                    ${Number(product.precioBase).toFixed(2)}
                  </span>
                  <span
                    className={`admin-page__item-state admin-page__item-state--${status.toLowerCase()}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                  <span className="admin-page__actions">
                    {canEdit && (
                      <button
                        className="admin-page__action"
                        type="button"
                        onClick={() => startEdit(product)}
                      >
                        EDITAR
                      </button>
                    )}
                    {canDeactivate && (
                      <button
                        className="admin-page__action admin-page__action--danger"
                        type="button"
                        onClick={() => handleSoftDelete(product.id)}
                      >
                        DESACTIVAR
                      </button>
                    )}
                    {canRestore && (
                      <button
                        className="admin-page__action admin-page__action--restore"
                        type="button"
                        onClick={() => handleRestore(product.id)}
                      >
                        RESTAURAR
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;