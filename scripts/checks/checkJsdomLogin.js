'use strict';

const { JSDOM, VirtualConsole } = require('jsdom');
const { serveDir } = require('../lib/staticServer');

function waitFor(fn, { timeout = 8000, interval = 50, label = 'condición' } = {}) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function tick() {
      let value;
      try { value = fn(); } catch (e) { value = undefined; }
      if (value) return resolve(value);
      if (Date.now() - start > timeout) return reject(new Error(`Timeout esperando: ${label}`));
      setTimeout(tick, interval);
    })();
  });
}

function setNativeValue(window, element, value) {
  const proto = element.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(element, value);
  element.dispatchEvent(new window.Event('input', { bubbles: true }));
  element.dispatchEvent(new window.Event('change', { bubbles: true }));
}

function click(window, element) {
  element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
}

function findButtonByText(document, text) {
  const buttons = Array.from(document.querySelectorAll('button'));
  return buttons.find(b => (b.textContent || '').includes(text)) || null;
}

async function loginStaff(window) {
  click(window, await waitFor(() => findButtonByText(window.document, 'Staff Técnico'), { label: 'botón "Staff Técnico"' }));
  const passInput = await waitFor(() => window.document.querySelector('input[type="password"], input[type="text"]'), { label: 'campo de contraseña' });
  setNativeValue(window, passInput, 'Staffoldgabs');
  click(window, await waitFor(() => findButtonByText(window.document, 'Ingresar'), { label: 'botón "Ingresar"' }));
}

async function loginJugadora(window) {
  click(window, await waitFor(() => findButtonByText(window.document, 'Jugadora'), { label: 'botón "Jugadora"' }));
  const select = await waitFor(() => window.document.querySelector('select'), { label: 'selector de jugadora' });
  const firstOption = Array.from(select.options).find(o => o.value);
  if (!firstOption) throw new Error('El selector de jugadora no tiene opciones (ALL_JUGADORAS vacío).');
  setNativeValue(window, select, firstOption.value);
  const passInput = await waitFor(() => window.document.querySelector('input[type="password"], input[type="text"]'), { label: 'campo de contraseña' });
  setNativeValue(window, passInput, '1eraoldgabs');
  click(window, await waitFor(() => findButtonByText(window.document, 'Ingresar'), { label: 'botón "Ingresar"' }));
}

// Visita: botón "Visita" -> contraseña "Invitado" -> elegir "Ver como Staff Técnico"
// (la otra sub-opción, "Ver como Jugadora", reusa los mismos componentes Player* que
// ya se ejercitan en el flujo de Jugadora, así que no hace falta duplicarlo acá).
async function loginVisita(window) {
  click(window, await waitFor(() => findButtonByText(window.document, 'Visita'), { label: 'botón "Visita"' }));
  const passInput = await waitFor(() => window.document.querySelector('input[type="password"], input[type="text"]'), { label: 'campo de contraseña de Visita' });
  setNativeValue(window, passInput, 'Invitado');
  click(window, await waitFor(() => findButtonByText(window.document, 'Ingresar'), { label: 'botón "Ingresar" de Visita' }));
  click(window, await waitFor(() => findButtonByText(window.document, 'Ver como Staff Técnico'), { label: 'botón "Ver como Staff Técnico"' }));
}

const ROLES = [
  { tipo: 'staff', login: loginStaff },
  { tipo: 'jugadora', login: loginJugadora },
  { tipo: 'visita (como Staff Técnico)', login: loginVisita },
];

async function runOneRole(baseUrl, role) {
  const consoleErrors = [];
  const pageErrors = [];

  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', err => {
    pageErrors.push(err && err.message ? err.message : String(err));
  });

  const dom = await JSDOM.fromURL(`${baseUrl}/index.html`, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      const origError = window.console.error.bind(window.console);
      window.console.error = (...args) => {
        consoleErrors.push(args.map(a => (a && a.stack) || String(a)).join(' '));
        origError(...args);
      };
      // La app trae datos GPS en vivo (useGPSData) y guarda Wellness/RPE/Asistencia vía
      // fetch al Apps Script. Ese tráfico real ya se valida aparte (checkGPSSheet); acá
      // solo nos importa que la UI monte y no tire errores, así que se mockea fetch.
      window.fetch = () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve(''),
      });
      window.addEventListener('error', e => {
        pageErrors.push(e.error && e.error.stack ? e.error.stack : e.message);
      });
      window.addEventListener('unhandledrejection', e => {
        pageErrors.push('unhandledrejection: ' + (e.reason && e.reason.stack ? e.reason.stack : e.reason));
      });
    },
  });

  const { window } = dom;
  try {
    await waitFor(() => window.document.readyState === 'complete', { label: 'window load' });
    await waitFor(() => window.document.getElementById('root') && window.document.getElementById('root').children.length > 0, { label: 'render inicial (#root con contenido)' });

    await role.login(window);

    // Login exitoso: aparece el botón "Salir" del header del dashboard
    await waitFor(() => findButtonByText(window.document, 'Salir'), { timeout: 8000, label: 'dashboard tras login (botón "Salir")' });

    // Dejar correr microtasks/efectos un instante más por si hay errores asíncronos
    await new Promise(r => setTimeout(r, 300));

    const allErrors = [...consoleErrors, ...pageErrors];
    return { tipo: role.tipo, ok: allErrors.length === 0, errors: allErrors };
  } catch (e) {
    return { tipo: role.tipo, ok: false, errors: [...consoleErrors, ...pageErrors, `Fallo simulando login: ${e.message}`] };
  } finally {
    window.close();
  }
}

async function runLoginSmokeTests(buildDir) {
  const { server, url } = await serveDir(buildDir);
  try {
    const results = [];
    for (const role of ROLES) {
      results.push(await runOneRole(url, role));
    }
    return { ok: results.every(r => r.ok), results };
  } finally {
    server.close();
  }
}

module.exports = { runLoginSmokeTests };

if (require.main === module) {
  const path = require('path');
  const buildDir = path.resolve(__dirname, '..', '..', 'build');
  runLoginSmokeTests(buildDir).then(res => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.ok ? 0 : 1);
  }).catch(e => {
    console.error(e.stack || e.message);
    process.exit(1);
  });
}
