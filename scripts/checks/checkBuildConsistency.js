'use strict';

const path = require('path');
const { execFileSync } = require('child_process');

// Verifica que build/index.html referencie únicamente archivos que existen EN EL COMMIT
// (no en el filesystem local). build/ está trackeado en el repo y Vercel puede llegar a
// servirlo tal cual — si se commitea un index.html que apunta a un bundle con un hash que
// no se llegó a "git add", el deploy queda roto aunque el archivo exista en tu disco
// (por ejemplo, si corriste npm run build a mano y te olvidaste de agregarlo). Por eso
// lee todo vía `git show <ref>:<path>` en vez de fs.existsSync, y corre ANTES de que el
// propio hook pise build/ con un build fresco.
function gitShow(ref, relPath, cwd) {
  try {
    return execFileSync('git', ['show', `${ref}:${relPath}`], { cwd, encoding: 'utf8' });
  } catch (e) {
    return null;
  }
}

function gitFileExists(ref, relPath, cwd) {
  try {
    execFileSync('git', ['cat-file', '-e', `${ref}:${relPath}`], { cwd, stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function extractLocalRefs(html) {
  const refs = [];
  const attrRe = /\b(?:src|href)=["']([^"']+)["']/g;
  let m;
  while ((m = attrRe.exec(html))) {
    const url = m[1];
    if (!url.startsWith('/')) continue; // ignorar externas/relativas raras
    refs.push(url.split('?')[0].split('#')[0]);
  }
  return [...new Set(refs)];
}

function checkBuildConsistency(repoRoot, ref = 'HEAD') {
  const errors = [];
  const indexRelPath = 'build/index.html';

  const html = gitShow(ref, indexRelPath, repoRoot);
  if (html == null) {
    return { errors: [`No encontré ${indexRelPath} en el commit ${ref} — ¿build/ no está commiteado?`], refsChecked: 0 };
  }

  const refs = extractLocalRefs(html);
  let refsChecked = 0;

  for (const ref_ of refs) {
    const relPath = path.posix.join('build', ref_.replace(/^\//, ''));
    refsChecked++;
    if (!gitFileExists(ref, relPath, repoRoot)) {
      errors.push(`build/index.html referencia "${ref_}" pero "${relPath}" no está en el commit ${ref} (¿faltó un "git add"?).`);
    }
  }

  if (refs.length === 0) {
    errors.push('No encontré ninguna referencia src="/..." o href="/..." en build/index.html — ¿cambió la estructura del HTML?');
  }

  return { errors, refsChecked };
}

module.exports = { checkBuildConsistency };

if (require.main === module) {
  const repoRoot = path.resolve(__dirname, '..', '..');
  const ref = process.argv[2] || 'HEAD';
  const res = checkBuildConsistency(repoRoot, ref);
  console.log(JSON.stringify(res, null, 2));
  process.exit(res.errors.length ? 1 : 0);
}
