'use strict';

const fs = require('fs');

// Extrae y evalúa, tal cual están en src/App.jsx, las funciones que la app usa
// en producción para bajar y parsear la planilla GPS real (APPS_URL, parseMin,
// parseNum, fmtDate, GPS_SKIP, parseGPSSheet). Así el hook valida exactamente
// la misma lógica que ve la coach en el dashboard, no una reimplementación
// aparte que se puede desincronizar.
function findFunctionEnd(source, fnStart) {
  const openBrace = source.indexOf('{', fnStart);
  let depth = 0;
  for (let i = openBrace; i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  throw new Error('No pude encontrar el cierre de la función en App.jsx (¿cambió la estructura del archivo?).');
}

function extractAppGPSParser(appJsxPath) {
  const source = fs.readFileSync(appJsxPath, 'utf8');

  const startMarker = 'const APPS_URL=';
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error('No encontré "const APPS_URL=" en App.jsx — ¿cambió el nombre de la constante?');

  const fnMarker = 'function parseGPSSheet(';
  const fnStart = source.indexOf(fnMarker, start);
  if (fnStart === -1) throw new Error('No encontré "function parseGPSSheet(" en App.jsx después de APPS_URL.');
  const fnEnd = findFunctionEnd(source, fnStart);

  const code = source.slice(start, fnEnd);
  // eslint-disable-next-line no-new-func
  const factory = new Function(
    `${code}\nreturn { APPS_URL, parseMin, parseNum, fmtDate, GPS_SKIP, parseGPSSheet };`
  );
  const real = factory();

  // Variante "sin filtro": misma lógica de bloques/offset que la real, pero en vez de
  // descartar en silencio las filas con Minutos<=0 o Distancia vacía/0 (como hace la app
  // en producción), las incluye marcadas con _dropped. Así el hook puede detectar cuándo
  // una jugadora "desaparece" del dashboard por un dato mal cargado en la planilla.
  const filterLine = 'if(mins<=0||!dist_raw||dist_raw<=0) continue;';
  const pushFieldsMarker = 'ns:rnd(g(9)),vmax:rnd1(g(10)),pl:rnd(g(11))';
  if (!code.includes(filterLine) || !code.includes(pushFieldsMarker)) {
    throw new Error('parseGPSSheet en App.jsx cambió de forma inesperada (no encontré el filtro de Minutos/Distancia) — hay que actualizar extractAppGPSParser.js.');
  }
  const unfilteredCode = code
    .replace(filterLine, "const _dropped=(mins<=0||!dist_raw||dist_raw<=0)?(mins<=0?'Minutos vacío o 0':'Distancia vacía o 0'):null;")
    .replace(pushFieldsMarker, pushFieldsMarker + ',_dropped:_dropped')
    .replace('function parseGPSSheet(', 'function parseGPSSheetUnfiltered(');
  // eslint-disable-next-line no-new-func
  const unfilteredFactory = new Function(
    `${unfilteredCode}\nreturn { parseGPSSheetUnfiltered };`
  );
  const { parseGPSSheetUnfiltered } = unfilteredFactory();

  return { ...real, parseGPSSheetUnfiltered };
}

module.exports = { extractAppGPSParser };
