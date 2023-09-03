// MIT License

// Copyright (c) 2023 Mateo Álvarez Murillo

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";
var count = 0;

function esDireccionIPValida(valor) {
  const ipRegex =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(valor);
}

async function hacerPeticionGET(ipa) {
  try {
    const API_KEY = "";
    const URL =
      "https://geo.ipify.org/api/v2/country?apiKey=" + API_KEY + "&ipAddress=";
    const response = await fetch(URL + ipa);
    if (!response.ok) {
      throw new Error(
        "Error en la petición. Código de estado: " + response.status
      );
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error al hacer la petición:", error.message);
    throw error;
  }
}

async function rellenarCampos(ipe) {
  try {
    const data = await hacerPeticionGET(ipe);
    const txt1 = document.getElementById("texto1");
    const txt2 = document.getElementById("texto2");
    const txt3 = document.getElementById("texto3");
    const txt4 = document.getElementById("texto4");
    const time = await data.location.timezone;
    txt1.textContent = await data.ip;
    txt2.textContent = await (data.location.country +
      " " +
      data.location.region);
    txt3.textContent = "UTC " + time;
    txt4.textContent = await data.isp;
  } catch (err) {
    console.error(err.message);
    throw error;
  }
}

async function obtenerLatitudLongitudDesdeIP(ip) {
  try {
    const url = `http://ip-api.com/json/${ip}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Error en la petición. Código de estado: " + response.status
      );
    }

    let data = await response.json();
    let latitud = await data.lat;
    let longitud = await data.lon;
    return { latitud, longitud };
  } catch (error) {
    console.error("Error al obtener la latitud y longitud:", error.message);
    throw error;
  }
}

async function obtenerIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error(
        "Error en la petición. Código de estado: " + response.status
      );
    }
    const data = await response.json();
    const ip = data.ip;
    return ip;
  } catch (error) {
    console.error("Error al obtener la dirección IP:", error.message);
    throw error;
  }
}
var map;
function dibujarMapa(ip_address) {
  obtenerLatitudLongitudDesdeIP(ip_address)
    .then((coordenadas) => {
      console.log("Latitud:", coordenadas.latitud);
      console.log("Longitud:", coordenadas.longitud);
      map = L.map("map").setView(
        [coordenadas.latitud, coordenadas.longitud],
        16
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);
    })
    .catch((error) => {
      console.error("Error general:", error);
    });
}

obtenerIP()
  .then((ip) => {
    dibujarMapa(ip);
    rellenarCampos(ip);
  })
  .catch((error) => {
    console.error("Error general:", error);
  });

function redibujarMapa(ip_address) {
  obtenerLatitudLongitudDesdeIP(ip_address)
    .then((coordenadas) => {
      console.log("Latitud:", coordenadas.latitud);
      console.log("Longitud:", coordenadas.longitud);
      map.flyTo([coordenadas.latitud, coordenadas.longitud], 16);
    })
    .catch((error) => {
      console.error("Error general:", error);
    });
}

const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  let ip_address = document.getElementById("ip").value;
  if (esDireccionIPValida(ip_address)) {
    redibujarMapa(ip_address);
    rellenarCampos(ip_address);
    // location.reload();
  } else {
    alert("Ingresa una dirección IP válida");
  }
});
