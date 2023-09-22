// Autor: Mateo Álvarez Murillo
// Fecha de creación: 2023

// Este código se proporciona bajo la Licencia MIT.
// Para más información, consulta el archivo LICENSE en la raíz del repositorio.

/* eslint-disable no-undef */

// CAMBIAR AL REGISTRARSE EN LA API #2
//////////////////////////////////////
const TOKEN = "AQUI_VA_EL_TOKEN";
//////////////////////////////////////

const labelIp = document.getElementById("labelIp");
const labelLocation = document.getElementById("labelLocation");
const labelTime = document.getElementById("labelTime");
const labelISP = document.getElementById("labelISP");
const btn = document.getElementById("btn");
let map;

function isValidIPAddress(value) {
  const ipRegex =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(value);
}

async function getIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    const ip = await data.ip;
    return ip;
  } catch (error) {
    console.log("Error get IP: ", error.message);
    throw error;
  }
}

async function getLatitudeLongitudeFromIP(ip) {
  try {
    const url = "https://ipinfo.io/" + ip + "/json?token=" + TOKEN;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error: " + response.status);
    }
    let data = await response.json();
    let nums = await data.loc.split(",");
    let lat = await parseInt(nums[0]);
    let lon = await parseInt(nums[1]);
    let textoTime = await data.timezone;
    let palabras = await data.org.split(" ");
    palabras.shift();

    labelIp.textContent = await data.ip;
    labelLocation.textContent = await (data.region + ", " + data.city);
    labelTime.textContent = textoTime.replace("_", " ");
    labelISP.textContent = await palabras.join(" ");

    return { lat, lon };
  } catch (error) {
    console.error("Error get latitude longitude from IP:", error.message);
    throw error;
  }
}

function drawMap(ip_address) {
  getLatitudeLongitudeFromIP(ip_address)
    .then((coordinates) => {
      map = L.map("map").setView([coordinates.lat, coordinates.lon], 14);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 14,
        attribution: "© OpenStreetMap",
      }).addTo(map);
    })
    .catch((error) => {
      console.error("Error  :", error);
    });
}

function redrawMap(ip_address) {
  getLatitudeLongitudeFromIP(ip_address)
    .then((coordenadas) => {
      map.flyTo([coordenadas.lat, coordenadas.lon], 14);
    })
    .catch((error) => {
      console.error("Error redraw Map:", error);
    });
}

getIP()
  .then((ip) => {
    drawMap(ip);
  })
  .catch((error) => {
    console.error("Error get IP:", error);
  });

btn.addEventListener("click", () => {
  let ip_address = document.getElementById("ip").value;
  if (isValidIPAddress(ip_address)) {
    redrawMap(ip_address);
  } else {
    alert("Please enter a valid IP address");
  }
});
