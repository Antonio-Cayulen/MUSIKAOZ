document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.auth-box__form');
  const emailInput = document.getElementById('username');
  const passInput = document.getElementById('password');

  const showError = (input, message) => {
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains('auth-field__error')) {
      errorEl = document.createElement('span');
      errorEl.className = 'auth-field__error';
      errorEl.style.color = '#ff3914';
      errorEl.style.fontSize = '0.65rem';
      errorEl.style.marginTop = '0.25rem';
      input.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
    input.style.borderColor = '#ff3914';
  };

  const clearError = (input) => {
    const errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains('auth-field__error')) {
      errorEl.remove();
    }
    input.style.borderColor = '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const userVal = emailInput.value.trim();
    const passVal = passInput.value.trim();

    if (!userVal) {
      showError(emailInput, '[ERROR]: IDENTIFICADOR REQUERIDO');
      valid = false;
    } else {
      clearError(emailInput);
    }

    if (!passVal) {
      showError(passInput, '[ERROR]: CONTRASEÑA REQUERIDA');
      valid = false;
    } else {
      clearError(passInput);
    }

    if (valid) {
      if (userVal === 'admin' && passVal === 'admin') {
        localStorage.setItem('user_role', 'admin');
      } else {
        localStorage.setItem('user_role', 'user');
      }
      window.location.href = '../feed/feed.html';
    }
  });
});
