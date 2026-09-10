document.addEventListener('DOMContentLoaded', () => {
  const comunasPorRegion = {
    RM: ['Santiago', 'Providencia', 'Maipú', 'Puente Alto'],
    VALPO: ['Valparaíso', 'Viña del Mar', 'Quilpué']
  };

  const regionSelect = document.getElementById('region');
  const comunaSelect = document.getElementById('comuna');
  const form = document.getElementById('register-form');

  const setError = (input, message) => {
    input.style.borderColor = '#ff3914';
    input.style.boxShadow = '0 0 8px rgba(255, 57, 20, 0.4)';
    let errorEl = input.parentNode.querySelector('.auth-field__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'auth-field__error';
      errorEl.style.color = '#ff3914';
      errorEl.style.fontSize = '0.65rem';
      errorEl.style.marginTop = '0.25rem';
      errorEl.style.display = 'block';
      input.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  };

  const clearError = (input) => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
    const errorEl = input.parentNode.querySelector('.auth-field__error');
    if (errorEl) errorEl.remove();
  };

  form.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', () => clearError(element));
    element.addEventListener('change', () => clearError(element));
  });

  regionSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    comunaSelect.innerHTML = '<option value="">SELECCIONAR</option>';
    if (val && comunasPorRegion[val]) {
      comunasPorRegion[val].forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        comunaSelect.appendChild(opt);
      });
      comunaSelect.disabled = false;
    } else {
      comunaSelect.disabled = true;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const runInput = document.getElementById('run');
    const correoInput = document.getElementById('correo');
    const nombreInput = document.getElementById('nombre');
    const apellidosInput = document.getElementById('apellidos');
    const regionInput = document.getElementById('region');
    const comunaInput = document.getElementById('comuna');
    const direccionInput = document.getElementById('direccion');

    const runRegex = /^[0-9]{7,8}[0-9kK]{1}$/;
    const mailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    if (!runRegex.test(runInput.value.trim())) {
      setError(runInput, '[ERROR]: 7-9 CARACTERES SIN PUNTOS NI GUION');
      isValid = false;
    }

    if (!mailRegex.test(correoInput.value.trim())) {
      setError(correoInput, '[ERROR]: DOMINIO NO PERMITIDO (@duoc.cl, @profesor.duoc.cl, @gmail.com)');
      isValid = false;
    }

    if (!nombreInput.value.trim()) {
      setError(nombreInput, '[ERROR]: NOMBRE REQUERIDO');
      isValid = false;
    }

    if (!apellidosInput.value.trim()) {
      setError(apellidosInput, '[ERROR]: APELLIDOS REQUERIDOS');
      isValid = false;
    }

    if (!regionInput.value) {
      setError(regionInput, '[ERROR]: SELECCIONE REGION');
      isValid = false;
    }

    if (!comunaInput.value && !comunaInput.disabled) {
      setError(comunaInput, '[ERROR]: SELECCIONE COMUNA');
      isValid = false;
    }

    if (!direccionInput.value.trim()) {
      setError(direccionInput, '[ERROR]: DIRECCION REQUERIDA');
      isValid = false;
    }

    if (isValid) {
      const newUser = {
        run: runInput.value.trim(),
        nombre: nombreInput.value.trim(),
        apellidos: apellidosInput.value.trim(),
        correo: correoInput.value.trim(),
        direccion: direccionInput.value.trim(),
        role: 'Cliente'
      };

      const users = JSON.parse(localStorage.getItem('kaoz_users') || '[]');
      users.push(newUser);
      localStorage.setItem('kaoz_users', JSON.stringify(users));

      window.location.href = '../login/login.html';
    }
  });
});
