'use strict';

// Descarga filas crudas de una hoja vía el Apps Script real que usa la app
// (?accion=gps&hoja=X). El endpoint responde con un 302 a script.googleusercontent.com;
// fetch de Node sigue redirects por default.
async function fetchGPSRows(appsUrl, hoja) {
  const url = `${appsUrl}?accion=gps&hoja=${encodeURIComponent(hoja)}`;
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error(`No pude conectarme al Apps Script para descargar "${hoja}" (¿sin red?): ${e.message}`);
  }
  if (!res.ok) {
    throw new Error(`El Apps Script devolvió ${res.status} al pedir la hoja "${hoja}". Verificá que el deploy siga activo.`);
  }
  let rows;
  try {
    rows = await res.json();
  } catch (e) {
    throw new Error(`La respuesta de accion=gps&hoja=${hoja} no es JSON válido — ¿el Apps Script cambió de formato?`);
  }
  if (!Array.isArray(rows)) {
    throw new Error(`La respuesta de accion=gps&hoja=${hoja} no es un array de filas como se esperaba.`);
  }
  return rows;
}

module.exports = { fetchGPSRows };
