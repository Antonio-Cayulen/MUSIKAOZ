document.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('user_role');
  const sidebarNav = document.querySelector('.sidebar__nav');

  if (role === 'admin' && sidebarNav && !document.querySelector('.js-admin-link')) {
    const adminLink = document.createElement('a');
    adminLink.className = 'sidebar__link js-admin-link';
    adminLink.href = '../admin/admin.html';
    adminLink.textContent = '[03] ADMIN_PANEL';
    sidebarNav.appendChild(adminLink);
  }

  const currentTrackLabel = document.getElementById('current-track');
  const playButtons = document.querySelectorAll('.js-play-btn');
  const mainPlayBtn = document.getElementById('btn-play');
  let isPlaying = false;

  playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const trackName = e.target.getAttribute('data-track');
      currentTrackLabel.textContent = `REPRODUCIENDO: ${trackName.toUpperCase()}`;
      isPlaying = true;
      mainPlayBtn.textContent = 'PAUSE';
    });
  });

  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => {
      if (currentTrackLabel.textContent === 'SIN_REPRODUCCION') return;
      isPlaying = !isPlaying;
      mainPlayBtn.textContent = isPlaying ? 'PAUSE' : 'PLAY';
    });
  }
});
