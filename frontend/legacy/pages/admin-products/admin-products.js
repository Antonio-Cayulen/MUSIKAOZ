document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');
  const list = document.getElementById('products-list');
  const products = JSON.parse(localStorage.getItem('kaoz_products') || '[]');

  const setError = (input) => {
    input.style.borderColor = '#ff3914';
    input.style.boxShadow = '0 0 8px rgba(255, 57, 20, 0.4)';
  };

  const clearError = (input) => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  };

  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  const renderProducts = () => {
    list.innerHTML = '';
    products.forEach(p => {
      const isCritical = p.stock <= (p.critical || 0);
      const tr = document.createElement('tr');
      tr.className = 'admin-table__row';
      tr.innerHTML = `
        <td class="admin-table__cell">${p.code}</td>
        <td class="admin-table__cell">${p.name}</td>
        <td class="admin-table__cell">CLP $${Number(p.price).toLocaleString('es-CL')}</td>
        <td class="admin-table__cell">${p.stock}</td>
        <td class="admin-table__cell">${isCritical ? '<span style="color:#ff3914;">⚠ STOCK CRÍTICO</span>' : '<span style="color:#39ff14;">OK</span>'}</td>
      `;
      list.appendChild(tr);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const codeInput = document.getElementById('p-code');
    const nameInput = document.getElementById('p-name');
    const priceInput = document.getElementById('p-price');
    const stockInput = document.getElementById('p-stock');
    const catSelect = document.getElementById('p-cat');

    if (codeInput.value.trim().length < 3) {
      setError(codeInput);
      isValid = false;
    }

    if (!nameInput.value.trim()) {
      setError(nameInput);
      isValid = false;
    }

    if (priceInput.value === '' || Number(priceInput.value) < 0) {
      setError(priceInput);
      isValid = false;
    }

    if (stockInput.value === '' || Number(stockInput.value) < 0) {
      setError(stockInput);
      isValid = false;
    }

    if (!catSelect.value) {
      setError(catSelect);
      isValid = false;
    }

    if (!isValid) return;

    const newProduct = {
      code: codeInput.value.trim(),
      name: nameInput.value.trim(),
      price: Number(priceInput.value),
      stock: Number(stockInput.value),
      critical: Number(document.getElementById('p-critical').value || 0),
      cat: catSelect.value
    };

    products.push(newProduct);
    localStorage.setItem('kaoz_products', JSON.stringify(products));
    form.reset();
    renderProducts();
  });

  renderProducts();
});
