'use strict';

const path = require('path');
const { extractAppGPSParser } = require('../lib/extractAppGPSParser');
const { fetchGPSRows } = require('../lib/fetchGPSSheet');

// Hojas que la app lee en vivo (useGPSData en App.jsx) y el "tipo" que le pasa a parseGPSSheet.
const HOJAS = [
  { hoja: 'Partidos', tipo: 'partido' },
  { hoja: 'Amistosos', tipo: 'amistoso' },
  { hoja: 'Entrenamientos', tipo: 'entreno' },
];

async function checkGPSSheet(appJsxPath) {
  const errors = [];
  const warnings = [];
  const parser = extractAppGPSParser(appJsxPath);

  let sessionsChecked = 0;
  let jugadorasChecked = 0;

  for (const { hoja, tipo } of HOJAS) {
    let rows;
    try {
      rows = await fetchGPSRows(parser.APPS_URL, hoja);
    } catch (e) {
      errors.push(`Hoja "${hoja}": ${e.message}`);
      continue;
    }

    let sessions, sessionsRaw;
    try {
      sessions = parser.parseGPSSheet(rows, tipo);
      sessionsRaw = parser.parseGPSSheetUnfiltered(rows, tipo);
    } catch (e) {
      errors.push(`Hoja "${hoja}": parseGPSSheet tiró una excepción — ${e.message}`);
      continue;
    }

    if (sessions.length === 0) {
      warnings.push(`Hoja "${hoja}": parseGPSSheet no encontró ninguna sesión (¿hoja vacía o cambió de estructura?).`);
      continue;
    }

    // sessionsRaw tiene las mismas sesiones que sessions, en el mismo orden, pero sin
    // descartar filas con Minutos/Distancia en 0 o vacío — así se detecta cuándo una
    // jugadora "desaparece" silenciosamente del dashboard por un dato mal cargado.
    for (let i = 0; i < sessionsRaw.length; i++) {
      const raw = sessionsRaw[i];
      const filtered = sessions.find(s => s.id === raw.id) || sessions[i];
      sessionsChecked++;

      // Filtrar artefactos: a veces una fila-fecha del siguiente entreno (ej. objeto Date
      // de Sheets serializado como "Mon Aug 03 2026 00:00:00 GMT...") no matchea ningún
      // terminador de bloque y termina leída como si fuera el nombre de una jugadora, con
      // Minutos/Distancia vacíos. Eso no es una jugadora real perdida — no reportar.
      const looksLikeDateArtifact = n => /GMT|^\w{3}\s\w{3}\s\d{2}\s\d{4}/i.test(n);
      const dropped = raw.jugadoras.filter(j => j._dropped && !looksLikeDateArtifact(j.n));
      if (dropped.length) {
        errors.push(
          `Hoja "${hoja}" — "${raw.label}" (${raw.fecha}): ${dropped.length} jugadora(s) no aparecen en el dashboard porque su fila tiene ` +
          `${dropped.map(j => `${j.n} (${j._dropped})`).join(', ')}. La sesión debería tener ${raw.jugadoras.length} jugadoras y el dashboard va a mostrar ${filtered ? filtered.jugadoras.length : 0}.`
        );
      }

      for (const j of raw.jugadoras) {
        if (j._dropped) continue;
        jugadorasChecked++;
        if (j.pl === 0) {
          errors.push(`Hoja "${hoja}" — "${raw.label}" — ${j.n}: Player Load = 0.`);
        }
      }
    }
  }

  return { errors, warnings, sessionsChecked, jugadorasChecked };
}

module.exports = { checkGPSSheet };

if (require.main === module) {
  const appJsxPath = path.resolve(__dirname, '..', '..', 'src', 'App.jsx');
  checkGPSSheet(appJsxPath).then(res => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.errors.length ? 1 : 0);
  }).catch(e => {
    console.error(e.stack || e.message);
    process.exit(1);
  });
}
