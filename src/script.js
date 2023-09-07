// Autor: Mateo Álvarez Murillo
// Fecha de creación: 2023

// Este código se proporciona bajo la Licencia MIT.
// Para más información, consulta el archivo LICENSE en la raíz del repositorio.

/* eslint-disable no-undef */

const labelIp = document.getElementById('labelIp');
const labelLocation = document.getElementById('labelLocation');
const labelTime = document.getElementById('labelTime');
const labelISP = document.getElementById('labelISP');
const btn = document.getElementById('btn');
let map;

function esDireccionIPValida(valor) {
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(valor);
}

async function obtenerIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error(`Error en la petición. Código de estado: ${response.status}`);
    }
    const data = await response.json();
    const ip = await data.ip;
    return ip;
  } catch (error) {
    console.log('Error al obtener la dirección IP: ', error.message);
    throw error;
  }
}

async function obtenerLatitudLongitudDesdeIP(ip) {
  try {
    const url = 'https://ipinfo.io/' + ip + '/json?token=' + TOKEN;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        'Error en la petición. Código de estado: ' + response.status
      );
    }
    let data = await response.json();
    let nums = await data.loc.split(',');
    let lat = await parseInt(nums[0]);
    let lon = await parseInt(nums[1]);
    let textoTime = await data.timezone;
    let palabras = await data.org.split(' ');
    palabras.shift();

    labelIp.textContent = await data.ip;
    labelLocation.textContent = await (data.region + ', ' + data.city);
    labelTime.textContent = textoTime.replace('_', ' ');
    labelISP.textContent = await palabras.join(' ');
    
    return { lat, lon };
  } catch (error) {
    console.error('Error al obtener la latitud y longitud:', error.message);
    throw error;
  }
}

function dibujarMapa(ip_address) {
  obtenerLatitudLongitudDesdeIP(ip_address)
    .then((coordenadas) => {
      map = L.map('map').setView(
        [coordenadas.latitud, coordenadas.longitud],
        14
      );

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 14,
        attribution: '© OpenStreetMap',
      }).addTo(map);
    })
    .catch((error) => {
      console.error('Error general:', error);
    });
}

function redibujarMapa(ip_address) {
  obtenerLatitudLongitudDesdeIP(ip_address)
    .then((coordenadas) => {
      map.flyTo([coordenadas.latitud, coordenadas.longitud], 14);
    })
    .catch((error) => {
      console.error('Error general:', error);
    });
}

obtenerIP()
  .then((ip) => {
    dibujarMapa(ip);
  })
  .catch((error) => {
    console.error('Error general:', error);
  });

btn.addEventListener('click', () => {
  let ip_address = document.getElementById('ip').value;
  if (esDireccionIPValida(ip_address)) {
    redibujarMapa(ip_address);
  } else {
    alert('Ingresa una dirección IP válida');
  }
});
