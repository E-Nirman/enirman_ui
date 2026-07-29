#!/usr/bin/env node
/*
 * check-token-parity — verify that every §4.2-reconciled tier-2 token in
 * theme.css resolves to the exact hex value the design spec
 * (colors_and_type.css, in the enirman_studio repo's docs/design/ export)
 * defines for that concept.
 *
 * The spec values are embedded below as a snapshot, not read live from
 * the sibling repo — §4 forbids vendoring colors_and_type.css into app
 * code, and this script is a checked-in regression test, not a runtime
 * token source. Re-run `docs/design/` diff by hand if the spec export
 * is ever revised, and update SPEC_HEX accordingly.
 *
 *   node scripts/check-token-parity.mjs
 */
import { readFileSync } from 'node:fs'

const ROOT = new URL('..', import.meta.url).pathname
const css = readFileSync(new URL('../src/theme.css', import.meta.url), 'utf8')

// Snapshot taken 2026-07-29 from
// docs/design/_ds/enirman-design-system-*/colors_and_type.css in enirman_studio.
const SPEC_HEX = {
  '--bg-canvas':  '#F6F8FA', // gray-50
  '--bg-surface': '#FFFFFF', // gray-0
  '--bg-sunken':  '#ECEFF3', // gray-100
  '--bg-inverse': '#0F2238', // brand-navy-800
  '--bg-brand':   '#16304D', // brand-navy-700
  '--bg-accent-subtle': '#EAF4FE', // brand-blue-50
  '--fg1': '#131722', // gray-900
  '--fg2': '#3A4250', // gray-700
  '--fg3': '#6B7585', // gray-500
  '--fg4': '#8B95A4', // gray-400
  '--fg-on-brand':  '#FFFFFF',
  '--fg-on-accent': '#FFFFFF',
  '--fg-link':       '#1B73D8', // brand-blue-500
  '--fg-link-hover': '#155CAE', // brand-blue-600
  '--border-default': '#CFD5DE', // gray-200
  '--border-brand':   '#16304D', // brand-navy-700
  '--action-primary':        '#1B73D8', // brand-blue-500
  '--action-primary-hover':  '#155CAE', // brand-blue-600
  '--action-primary-active': '#104785', // brand-blue-700
  '--action-secondary':       '#ECEFF3', // gray-100
  '--action-secondary-hover': '#DFE3EA', // gray-150
  '--action-danger': '#C32A2A', // danger-500
}

function hslTripleToHex(h, s, l) {
  s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase()
}

// Some tier-2 tokens are authored as a bare HSL triple (rounded to whole
// degrees/percent) rather than a hex literal, so their hex round-trip can be
// off by a unit or two per channel from the spec's exact hex — that's
// legitimate integer-rounding noise, not drift. TOLERANCE bounds it: catches
// a genuinely wrong color (a different swatch entirely) while not
// false-failing on rounding. Determined empirically: converting the spec's
// own gray-150/-200 hex through round-trip HSL rounding produced a max
// per-channel delta of 2.
const TOLERANCE = 2

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function colorsMatch(hexA, hexB) {
  if (hexA === hexB) return true
  const [ra, ga, ba] = hexToRgb(hexA)
  const [rb, gb, bb] = hexToRgb(hexB)
  return Math.abs(ra - rb) <= TOLERANCE && Math.abs(ga - gb) <= TOLERANCE && Math.abs(ba - bb) <= TOLERANCE
}

function resolve(name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`circular var reference: ${name}`)
  seen.add(name)

  const re = new RegExp(`--${name.replace(/^--/, '')}:\\s*([^;]+);`)
  const match = css.match(re)
  if (!match) throw new Error(`token not found in theme.css: ${name}`)
  const raw = match[1].trim()

  const varRef = raw.match(/^var\((--[\w-]+)\)$/)
  if (varRef) return resolve(varRef[1], seen)

  const hex = raw.match(/^#([0-9a-fA-F]{6})$/)
  if (hex) return `#${hex[1].toUpperCase()}`

  const hsl = raw.match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)
  if (hsl) return hslTripleToHex(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]))

  throw new Error(`unrecognized value shape for ${name}: "${raw}"`)
}

const mismatches = []
for (const [name, expectedHex] of Object.entries(SPEC_HEX)) {
  let actualHex
  try {
    actualHex = resolve(name)
  } catch (err) {
    mismatches.push({ name, expectedHex, actualHex: `ERROR: ${err.message}` })
    continue
  }
  if (!colorsMatch(actualHex, expectedHex)) {
    mismatches.push({ name, expectedHex, actualHex })
  }
}

if (mismatches.length) {
  console.error(`\n✗ ${mismatches.length} token(s) drifted from the design spec:\n`)
  for (const m of mismatches) {
    console.error(`   ${m.name}: expected ${m.expectedHex}, got ${m.actualHex}`)
  }
  console.error('\n  Fix theme.css (or update SPEC_HEX if the spec itself changed).')
  process.exit(1)
}

console.log(`✓ token parity: ${Object.keys(SPEC_HEX).length} tokens match the design spec`)
