const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyxMoUADQ5IDuoz3NbAyrmf8IcwKIHyuNJPVQ-ocrdK4FunCI4OhWPyihfH3jjrco2m8A/exec';

// 1. CARGAR OPCIONES DESDE GOOGLE SHEETS
function cargarOpciones() {
  // Si la URL aún no es la real de Google Apps Script, no hace nada para no dar error en pantalla
  if (!URL_APPS_SCRIPT.startsWith('https://script.google.com')) {
    console.log('Esperando la URL real de Apps Script para cargar las listas desplegables...');
    return;
  }

  fetch(URL_APPS_SCRIPT)
    .then(response => response.json())
    .then(data => {
      poblarSelect('destino', data.destino);
      poblarSelect('pants', data.pants);
      poblarSelect('shoes', data.shoes);
      poblarSelect('bag', data.bag);
    })
    .catch(error => {
      console.error('Error al cargar opciones desde Sheets:', error);
    });
}

function poblarSelect(idSelect, opciones) {
  const select = document.getElementById(idSelect);
  if (!select) return;
  select.innerHTML = '<option value="">-- Elige --</option>';
  
  if (opciones && opciones.length > 0) {
    opciones.forEach(opcion => {
      const opt = document.createElement('option');
      opt.value = opcion;
      opt.textContent = opcion;
      select.appendChild(opt);
    });
  }
}

// 2. ENVIAR FORMULARIO A GOOGLE SHEETS
const form = document.getElementById('miFormulario');
const btn = document.getElementById('btnEnviar');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!URL_APPS_SCRIPT.startsWith('https://script.google.com')) {
      alert('¡Atención! Aún no has configurado la URL de Google Apps Script.');
      return;
    }

    btn.disabled = true;
    btn.innerText = 'Enviando...';

    const datos = {
      fecha: document.getElementById('fecha').value,
      tipoAtuendo: document.getElementById('tipoAtuendo').value,
      destino: document.getElementById('destino').value,
      pants: document.getElementById('pants').value,
      shirt: document.getElementById('shirt').value,
      jersey: document.getElementById('jersey').value,
      shoes: document.getElementById('shoes').value,
      bag: document.getElementById('bag').value,
      hair: document.getElementById('hair').value
    };

    fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    .then(() => {
      alert('¡Outfit registrado con éxito en Google Sheets!');
      form.reset();
      const campoFecha = document.getElementById('fecha');
      if (campoFecha) campoFecha.valueAsDate = new Date();
    })
    .catch(err => {
      alert('Ocurrió un error al enviar.');
      console.error(err);
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerText = 'Guardar Registro';
    });
  });
}

// Establecer la fecha actual por defecto en el calendario
document.addEventListener('DOMContentLoaded', () => {
  const campoFecha = document.getElementById('fecha');
  if (campoFecha) campoFecha.valueAsDate = new Date();
  cargarOpciones();
});