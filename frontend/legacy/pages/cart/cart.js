document.addEventListener('DOMContentLoaded', () => {
  const cartItemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  let cart = JSON.parse(localStorage.getItem('kaoz_cart_items') || '[]');

  const renderCart = () => {
    cartItemsEl.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<tr><td colspan="3" style="padding: 1rem;">CARRITO VACÍO</td></tr>';
      totalEl.textContent = 'TOTAL: CLP $0';
      return;
    }

    cart.forEach((item, index) => {
      total += item.price;
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #1e242d';
      tr.innerHTML = `
        <td style="padding: 1rem;">${item.title}</td>
        <td style="padding: 1rem;">CLP $${item.price.toLocaleString('es-CL')}</td>
        <td style="padding: 1rem;">
          <button style="background: transparent; border: 1px solid #ff3914; color: #ff3914; padding: 0.2rem 0.5rem; cursor: pointer;" onclick="removeItem(${index})">ELIMINAR</button>
        </td>
      `;
      cartItemsEl.appendChild(tr);
    });

    totalEl.textContent = `TOTAL: CLP $${total.toLocaleString('es-CL')}`;
  };

  window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('kaoz_cart_items', JSON.stringify(cart));
    renderCart();
  };

  document.getElementById('btn-checkout').addEventListener('click', () => {
    if (cart.length === 0) return alert('[ERROR]: El carrito está vacío');
    alert('[SISTEMA]: Compra procesada con éxito. Licencias asignadas a tu cuenta.');
    localStorage.removeItem('kaoz_cart_items');
    cart = [];
    renderCart();
  });

  renderCart();
});
