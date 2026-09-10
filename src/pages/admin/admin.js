document.addEventListener('DOMContentLoaded', () => {
  const actionButtons = document.querySelectorAll('.js-action-btn');

  actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const user = e.target.getAttribute('data-user');
      const action = e.target.getAttribute('data-action');
      alert(`[ACCION_ADMIN]: ${action} ejecutado para el usuario ${user}`);
    });
  });
});
