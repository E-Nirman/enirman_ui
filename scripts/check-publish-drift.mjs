#!/usr/bin/env node
/*
 * check-publish-drift — refuse to publish when the registry holds source
 * that this working tree does not.
 *
 * History: @enirman/ui@1.4.2 and 1.4.3 were published from a tree that was
 * never committed. package.json said 1.4.1 while npm served 1.4.3, and the
 * published tarball carried src/components/ui/dialog/ConfirmDialog.vue —
 * a file that existed in no branch, and which enirman_connect imports.
 * Publishing the next version from git would have deleted it and broken
 * that app's build.
 *
 * This compares the file list of the currently-published `latest` tarball
 * against the file list this tree would publish, and fails on anything the
 * registry has that we would drop.
 *
 * Run before publishing (wired to prepublishOnly):
 *   npm run check:drift
 *
 * Escape hatch, for a deliberate removal:
 *   SKIP_DRIFT_CHECK=1 npm publish --access public
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

if (process.env.SKIP_DRIFT_CHECK) {
  console.warn('⚠  SKIP_DRIFT_CHECK set — skipping publish-drift check')
  process.exit(0)
}

const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim()

// ── what the registry currently serves ──────────────────────────────
let published
try {
  published = sh('npm', ['view', `${pkg.name}`, 'version', '--prefer-online'])
} catch (err) {
  console.error(`✗ could not reach the registry to check for drift.\n  ${String(err.stderr || err.message).trim()}`)
  console.error('  A publish without this check can silently delete files. Fix the network,')
  console.error('  or set SKIP_DRIFT_CHECK=1 if you know what you are doing.')
  process.exit(1)
}

if (!published) {
  console.log('✓ publish drift: nothing published yet')
  process.exit(0)
}

const tmp = mkdtempSync(join(tmpdir(), 'drift-'))
let publishedFiles
try {
  sh('npm', ['pack', `${pkg.name}@${published}`, '--pack-destination', tmp, '--silent'])
  const tgz = readdirSync(tmp).find((f) => f.endsWith('.tgz'))
  publishedFiles = sh('tar', ['-tzf', join(tmp, tgz)])
    .split('\n')
    .map((p) => p.replace(/^package\//, ''))
    .filter((p) => p && !p.endsWith('/'))
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

// ── what this tree would publish ────────────────────────────────────
const localFiles = JSON.parse(sh('npm', ['pack', '--dry-run', '--json']))[0].files.map((f) => f.path)

const localSet = new Set(localFiles)
const missing = publishedFiles.filter((f) => !localSet.has(f))

console.log(`  registry latest: ${pkg.name}@${published}`)
console.log(`  this tree:       ${pkg.name}@${pkg.version}`)

if (missing.length) {
  console.error(`\n✗ the published ${published} tarball contains ${missing.length} file(s) this tree would DROP:\n`)
  for (const f of missing) console.error(`   ${f}`)
  console.error(`
  Publishing now would delete them from the package and break any consumer
  that imports them. Someone likely published from an uncommitted tree.

  Recover them first:
    npm pack ${pkg.name}@${published} && tar -xzf ${pkg.name.replace('@', '').replace('/', '-')}-${published}.tgz
    # copy the missing files into src/, commit, then publish

  If the removal is deliberate (a real breaking change), re-run with:
    SKIP_DRIFT_CHECK=1 npm publish --access public
`)
  process.exit(1)
}

console.log('✓ publish drift: this tree is a superset of what npm serves')
