#!/usr/bin/env node
/*
 * check-theme-tokens — fail the build when a component paints a surface
 * with a colour that does not flip in dark mode.
 *
 * theme.css redefines the semantic tokens (--background, --card, --muted,
 * --border*, --foreground, --primary, and the tone families) under
 * [data-theme="dark"]. It deliberately does NOT redefine the raw scales
 * --gray-0..950 and --brand-{navy,blue,amber}-*: those are absolute
 * swatches for exact-colour work (SVG fills, slide artifacts).
 *
 * Painting a surface with a light-end raw swatch therefore renders a
 * white slab on the dark canvas. That is exactly how @enirman/ui@3.0.0
 * shipped a broken EuiProjectTimeline.
 *
 * ERROR   light-end raw swatches used as surfaces, and any Tailwind
 *         `-gray-N` class (the preset doesn't even define a gray scale,
 *         so those resolve to stock Tailwind gray — the wrong palette).
 * WARN    saturated brand swatches (400+). Usually a deliberate accent
 *         that reads in both themes; confirm, then mark it.
 *
 * Escape hatch: put `theme-token-ok` in a comment on the same line.
 *
 *   npm run check:tokens
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')

// Files that are allowed to speak in raw swatches.
const EXEMPT_PATHS = [
  'src/theme.css',
  'src/assets/',
  'tailwind-preset.js',
]

const LIGHT_END = /var\(--gray-(0|25|50|100|150|200|300)\)|var\(--brand-(?:navy|blue|amber)-(50|100|200|300)\)/
const RAW_GRAY_CLASS = /\b(?:bg|text|border|ring|fill|from|to|via)-gray-\d+/
const SATURATED_BRAND = /var\(--brand-(?:navy|blue|amber)-(400|500|600|700|800|900)\)|\b(?:bg|text|border|ring|fill)-(?:navy|blue|amber)-\d+/

const MARKER = 'theme-token-ok'

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(vue|js)$/.test(entry)) out.push(p)
  }
  return out
}

const errors = []
const warnings = []

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file)
  if (EXEMPT_PATHS.some((e) => rel.startsWith(e))) continue

  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes(MARKER)) return
    const loc = `${rel}:${i + 1}`
    if (LIGHT_END.test(line) || RAW_GRAY_CLASS.test(line)) {
      errors.push({ loc, line: line.trim().slice(0, 100) })
    } else if (SATURATED_BRAND.test(line)) {
      warnings.push({ loc, line: line.trim().slice(0, 100) })
    }
  })
}

if (warnings.length) {
  console.warn(`\n⚠  ${warnings.length} saturated brand swatch(es) — verify they read in dark mode, then add \`${MARKER}\`:`)
  for (const w of warnings) console.warn(`   ${w.loc}\n     ${w.line}`)
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} surface(s) painted with a colour that does NOT flip in dark mode:\n`)
  for (const e of errors) console.error(`   ${e.loc}\n     ${e.line}`)
  console.error(`
  Use semantic tokens instead — they flip:
    surfaces   hsl(var(--background|--card|--muted))
    borders    hsl(var(--border|--border-subtle|--border-strong))
    text       hsl(var(--foreground|--muted-foreground))
    accents    hsl(var(--primary)) or a tone family:
               --{info,success,warning,destructive,plus}[-muted|-ink]

  If a raw swatch is genuinely intended (an identity colour that reads in
  both themes), add \`${MARKER}\` in a comment on that line.
`)
  process.exit(1)
}

console.log(`✓ theme tokens: no non-flipping surfaces (${warnings.length} warning${warnings.length === 1 ? '' : 's'})`)
