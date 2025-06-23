// Funcionalidad del diario
const dateInput = document.getElementById('date');
const entryInput = document.getElementById('entry');
const entriesDiv = document.getElementById('entries');

function guardarEntrada() {
  const fecha = dateInput.value;
  const texto = entryInput.value.trim();

  if (!fecha || !texto) {
    alert("Por favor, ingresa una fecha y escribe sobre tu día.");
    return;
  }

  localStorage.setItem(`diario-${fecha}`, texto);
  entryInput.value = '';
  mostrarEntradas();
}

function mostrarEntradas() {
  entriesDiv.innerHTML = '';
  const claves = Object.keys(localStorage).filter(k => k.startsWith('diario-')).sort().reverse();
  
  if (claves.length === 0) {
    entriesDiv.innerHTML = '<p>No hay entradas aún. ¡Escribe sobre tu primer día!</p>';
    return;
  }

  claves.forEach(clave => {
    const fecha = clave.replace('diario-', '');
    const texto = localStorage.getItem(clave);

    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `<strong>${formatearFecha(fecha)}</strong><br>${texto}`;
    entriesDiv.appendChild(div);
  });
}

function formatearFecha(fechaStr) {
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES', opciones);
}

// Funcionalidad de pestañas
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Remover clase active de todos los botones y contenidos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Agregar clase active al botón clickeado y su contenido correspondiente
    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Funcionalidad del avatar
document.getElementById('avatar-upload').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('avatar').src = event.target.result;
      document.getElementById('avatar-large').src = event.target.result;
      localStorage.setItem('avatar', event.target.result);
    }
    reader.readAsDataURL(file);
  }
});

// Funcionalidad del perfil
document.getElementById('user-name').value = localStorage.getItem('user-name') || '';

function guardarPerfil() {
  const nombre = document.getElementById('user-name').value.trim();
  if (nombre) {
    localStorage.setItem('user-name', nombre);
    alert('Perfil guardado correctamente');
  }
}

// Funcionalidad de recuerdos (simplificada)
document.getElementById('memory-upload').addEventListener('change', function(e) {
  const files = e.target.files;
  const memoriesGrid = document.getElementById('memories-grid');
  
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const memoryItem = document.createElement('div');
      memoryItem.className = 'memory-item';
      
      if (file.type.startsWith('image')) {
        memoryItem.innerHTML = `<img src="${event.target.result}" alt="Recuerdo">`;
      } else if (file.type.startsWith('video')) {
        memoryItem.innerHTML = `<video controls><source src="${event.target.result}" type="${file.type}"></video>`;
      }
      
      memoriesGrid.appendChild(memoryItem);
    }
    reader.readAsDataURL(file);
  }
});

// Cargar datos al iniciar
window.onload = function() {
  mostrarEntradas();
  
  // Cargar avatar si existe
  if (localStorage.getItem('avatar')) {
    document.getElementById('avatar').src = localStorage.getItem('avatar');
    document.getElementById('avatar-large').src = localStorage.getItem('avatar');
  }
  
  // Establecer fecha actual por defecto
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;
};

// Ajustar el viewport cuando el teclado aparece en móviles
function adjustViewport() {
  if (window.innerWidth < 600) {
    const viewport = document.querySelector('meta[name="viewport"]');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
  }
}

// Llamar a la función al cargar y al redimensionar
window.addEventListener('load', adjustViewport);
window.addEventListener('resize', adjustViewport);

// Manejar el enfoque en textareas en móviles
entryInput.addEventListener('focus', function() {
  if (window.innerWidth < 600) {
    setTimeout(() => {
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }
});