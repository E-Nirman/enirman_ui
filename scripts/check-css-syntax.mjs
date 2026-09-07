#!/usr/bin/env node
/*
 * check-css-syntax — fail the build when src/theme.css is not valid CSS.
 *
 * History: @enirman/ui@5.2.0 shipped a theme.css where two doc-comments
 * separated adjacent token names with a bare slash (--fs-, star, slash,
 * --fw-, star, slash, --lh-, star). A star immediately followed by a
 * slash closes a CSS comment early no matter where it sits in the
 * prose, so the rest of each sentence spilled into CSS as bare,
 * meaningless tokens. `npm run check` stayed green anyway —
 * check-theme-tokens/check-token-parity/check-publish-drift are all
 * readFileSync + regex over raw text, none of them parses CSS, so a
 * malformed stylesheet was invisible to the package's own gate. Runtime
 * damage: --fs-2xs never got declared and .t-h1 never made it into
 * document.styleSheets — both consumers of the package broke on upgrade
 * before the mistake was caught by review.
 *
 * This script actually parses the file (postcss.parse — already a
 * devDependency for the Tailwind build, no new dependency added) and
 * additionally asserts that every .t-* semantic class and every
 * type-scale token this release added is actually present in the
 * parsed stylesheet — not grepped from the source — so a typo that
 * swallows a rule into a comment (this bug) or a rule that silently
 * fails to survive parsing for some other reason both fail loudly here
 * instead of shipping quietly.
 *
 *   npm run check:css
 */
import { readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import postcss from 'postcss'

const PKG_ROOT = new URL('..', import.meta.url).pathname
const THEME_PATH = new URL('../src/theme.css', import.meta.url).pathname

/*
 * Since the base/brands split, src/theme.css is a manifest of @import lines
 * and the rules themselves live in src/base.css and src/brands/*.css. Parse
 * theme.css and every local file it pulls in — each on its own rather than
 * as one concatenation, so a syntax error still names the real file and the
 * real line number.
 */
function collectRoots(file, roots = [], seen = new Set()) {
  if (seen.has(file)) return roots
  seen.add(file)

  let root
  try {
    root = postcss.parse(readFileSync(file, 'utf8'), { from: file })
  } catch (err) {
    console.error(`\n✗ ${relative(PKG_ROOT, file)} is not valid CSS:\n`)
    console.error(`   ${err.name}: ${err.message}`)
    if (typeof err.showSourceCode === 'function') {
      console.error(`\n${err.showSourceCode()}\n`)
    }
    console.error(`
  A CSS syntax error here is invisible to check:tokens/check:parity/
  check:drift — none of them parse the file. Common cause: a doc-comment
  whose prose contains a literal "*/" (e.g. "--fs-*/--fw-*"), which closes
  the comment early and dumps the rest into CSS as bare tokens. Use a
  comma or "and" instead of "/" between token names in comments.
`)
    process.exit(1)
  }

  roots.push(root)
  root.walkAtRules('import', (rule) => {
    // Local imports only; the remote webfont url() import has no file to read.
    const local = rule.params.match(/^['"](\.[^'"]+)['"]$/)
    if (local) collectRoots(resolve(dirname(file), local[1]), roots, seen)
  })
  return roots
}

const roots = collectRoots(THEME_PATH)

// ── every rule selector actually present after parsing ──────────────
const selectors = new Set()
for (const root of roots) {
  root.walkRules((rule) => {
    for (const sel of rule.selectors) selectors.add(sel.trim())
  })
}

// ── every custom property actually declared after parsing ───────────
const declaredProps = new Set()
for (const root of roots) {
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--')) declaredProps.add(decl.prop)
  })
}

const EXPECTED_T_CLASSES = [
  '.t-h1', '.t-h2', '.t-h3', '.t-h4', '.t-h5', '.t-h6',
  '.t-body-lg', '.t-body', '.t-body-sm',
  '.t-label', '.t-label-sm',
  '.t-caps', '.t-caps-sm',
  '.t-mono', '.t-mono-md',
  '.t-num',
]

const EXPECTED_SCALE_TOKENS = [
  '--fs-2xs', '--fs-xs', '--fs-sm', '--fs-md', '--fs-lg', '--fs-xl', '--fs-2xl', '--fs-3xl', '--fs-4xl',
  '--fw-regular', '--fw-medium', '--fw-semibold', '--fw-bold',
  '--lh-tight', '--lh-snug', '--lh-normal', '--lh-relaxed',
]

const missingClasses = EXPECTED_T_CLASSES.filter((c) => !selectors.has(c))
const missingTokens = EXPECTED_SCALE_TOKENS.filter((t) => !declaredProps.has(t))

if (missingClasses.length || missingTokens.length) {
  console.error(`\n✗ the theme stylesheets parsed, but expected rules/tokens are missing from the parse tree:\n`)
  if (missingClasses.length) {
    console.error(`   missing .t-* rule(s): ${missingClasses.join(', ')}`)
  }
  if (missingTokens.length) {
    console.error(`   missing custom propert${missingTokens.length === 1 ? 'y' : 'ies'}: ${missingTokens.join(', ')}`)
  }
  console.error(`
  The file parses without a syntax error but a rule or token this package
  is supposed to ship isn't actually in the parsed stylesheet — it may be
  nested inside another rule, spelled differently than expected, or (as
  in the C-1 regression) swallowed into a comment that closed later than
  intended. Check the source around the missing name(s).
`)
  process.exit(1)
}

const totalNodes = roots.reduce((n, r) => n + r.nodes.length, 0)
console.log(`✓ css syntax: ${roots.length} file(s) parse (${totalNodes} top-level nodes); ${EXPECTED_T_CLASSES.length} .t-* rules and ${EXPECTED_SCALE_TOKENS.length} type-scale tokens present`)
