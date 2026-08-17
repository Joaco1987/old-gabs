'use strict';

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Descarga filas crudas de una hoja vía el Apps Script real que usa la app
// (?accion=gps&hoja=X). El endpoint responde con un 302 a script.googleusercontent.com;
// fetch de Node sigue redirects por default.
// Google Apps Script a veces devuelve un error momentáneo (404/500) bajo carga aunque
// el deploy esté sano — reintenta un par de veces antes de bloquear el push por eso.
async function fetchGPSRows(appsUrl, hoja, { retries = 3, retryDelayMs = 1500 } = {}) {
  const url = `${appsUrl}?accion=gps&hoja=${encodeURIComponent(hoja)}`;
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        lastError = new Error(`El Apps Script devolvió ${res.status} al pedir la hoja "${hoja}".`);
        if (attempt < retries) { await sleep(retryDelayMs); continue; }
        throw new Error(`${lastError.message} Lo reintenté ${retries} veces — verificá que el deploy siga activo.`);
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
    } catch (e) {
      if (e.message.includes('JSON válido') || e.message.includes('array de filas')) throw e; // no reintentar errores de formato
      lastError = e;
      if (attempt < retries) { await sleep(retryDelayMs); continue; }
    }
  }
  throw new Error(`No pude conectarme al Apps Script para descargar "${hoja}" tras ${retries} intentos: ${lastError.message}`);
}

module.exports = { fetchGPSRows };
