document.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('user_role');
  const adminLink = document.querySelector('.sidebar__link[href*="admin.html"]');
  if (adminLink) {
    adminLink.style.display = (role === 'admin') ? 'block' : 'none';
  }

  let itemsInCart = 0;
  const cartCountEl = document.getElementById('cart-count');
  const filterBtns = document.querySelectorAll('.market-filters__tag');
  const beatCards = document.querySelectorAll('.beat-card');
  const searchInput = document.querySelector('.market-header__input');

  const showToast = (message) => {
    let toast = document.getElementById('kaoz-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'kaoz-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.padding = '1rem 1.5rem';
      toast.style.fontFamily = 'monospace';
      toast.style.fontSize = '0.8rem';
      toast.style.zIndex = '9999';
      toast.style.border = '1px solid #39ff14';
      toast.style.backgroundColor = '#0f1117';
      toast.style.color = '#39ff14';
      toast.style.boxShadow = '0 0 10px rgba(57, 255, 20, 0.2)';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';

    setTimeout(() => { toast.style.display = 'none'; }, 3000);
  };

  document.querySelectorAll('.js-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.beat-card');
      const title = card.querySelector('.beat-card__title').textContent;
      itemsInCart++;
      cartCountEl.textContent = `${itemsInCart} ITEMS`;
      showToast(`[SISTEMA]: "${title}" AÑADIDO AL CARRITO CON ÉXITO`);
    });
  });

  document.querySelectorAll('.js-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const title = e.target.getAttribute('data-title');
      showToast(`[REPRODUCIENDO DEMO]: ${title}`);
    });
  });

  const applyFilters = () => {
    const query = searchInput.value.toLowerCase();
    const activeTag = document.querySelector('.market-filters__tag--active').getAttribute('data-filter');

    beatCards.forEach(card => {
      const genre = card.getAttribute('data-genre');
      const text = card.textContent.toLowerCase();
      const matchesGenre = activeTag === 'all' || genre === activeTag;
      const matchesSearch = text.includes(query);

      card.style.display = (matchesGenre && matchesSearch) ? 'flex' : 'none';
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('market-filters__tag--active'));
      e.target.classList.add('market-filters__tag--active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
});
