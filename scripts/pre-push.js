#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function fail(msg) {
  console.error('\n✖ PUSH BLOQUEADO\n');
  console.error(msg);
  process.exit(1);
}

function formatLoginFailure(result) {
  return result.results
    .filter(r => !r.ok)
    .map(r => `Rol "${r.tipo}":\n  - ${r.errors.join('\n  - ')}`)
    .join('\n\n');
}

function formatGPSFailure(res) {
  return res.errors.map(e => `- ${e}`).join('\n');
}

async function main() {
  console.log('\n=== pre-push 1/4: build/ commiteado consistente (index.html vs. archivos reales) ===');
  const { checkBuildConsistency } = require('./checks/checkBuildConsistency');
  const consistencyResult = checkBuildConsistency(ROOT, 'HEAD');
  if (consistencyResult.errors.length) {
    fail(
      'El build/ que está commiteado ahora mismo (antes de recompilar) no es consistente — ' +
      'si Vercel lo sirve tal cual, el deploy queda roto:\n\n' +
      consistencyResult.errors.map(e => `- ${e}`).join('\n')
    );
    return;
  }
  console.log(`✔ build/index.html consistente (${consistencyResult.refsChecked} referencias OK).`);

  console.log('\n=== pre-push 2/4: npm run build ===');
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, CI: 'true' } });
  } catch (e) {
    fail('npm run build falló. Revisá el error de compilación de arriba.');
    return;
  }
  console.log('✔ build OK');

  console.log('\n=== pre-push 3/4: login Staff / Jugadora / Visita en jsdom (sin errores de consola) ===');
  const { runLoginSmokeTests } = require('./checks/checkJsdomLogin');
  const loginResult = await runLoginSmokeTests(path.join(ROOT, 'build'));
  if (!loginResult.ok) {
    fail(
      'Alguno de los logins (Staff / Jugadora / Visita) tira errores en consola o no llega al dashboard:\n\n' +
      formatLoginFailure(loginResult)
    );
    return;
  }
  console.log('✔ Staff, Jugadora y Visita cargan sin errores de consola.');

  console.log('\n=== pre-push 4/4: planilla GPS real (Partidos / Amistosos / Entrenamientos) ===');
  const { checkGPSSheet } = require('./checks/checkGPSSheet');
  let gpsResult;
  try {
    gpsResult = await checkGPSSheet(path.join(ROOT, 'src', 'App.jsx'));
  } catch (e) {
    fail('No pude validar la planilla GPS real:\n\n' + (e.stack || e.message));
    return;
  }
  gpsResult.warnings.forEach(w => console.warn('⚠ ' + w));
  if (gpsResult.errors.length) {
    fail(
      `parseGPSSheet encontró ${gpsResult.errors.length} problema(s) en la planilla real (Partidos/Amistosos/Entrenamientos):\n\n` +
      formatGPSFailure(gpsResult)
    );
    return;
  }
  console.log(`✔ Planilla GPS OK — ${gpsResult.sessionsChecked} sesiones / ${gpsResult.jugadorasChecked} jugadoras validadas, 0 errores.`);

  console.log('\n✔ pre-push OK — todo listo para pushear.\n');
}

main().catch(e => fail('Error inesperado en pre-push: ' + (e && e.stack || e)));
