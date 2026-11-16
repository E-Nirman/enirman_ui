import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import postcss from 'postcss'

/*
 * Static guarantees behind "zero visual change without data-platform":
 * parse every theme file and check what the platform file is allowed to
 * declare, where. (The rendered proof — a Chromium pixel diff of the
 * playground against 5.3.0 — is recorded in the 5.4.0 PR.)
 */
const read = (p) => postcss.parse(readFileSync(new URL(p, import.meta.url), 'utf8'))
const base = read('../base.css')
const aec = read('../brands/aec.css')
const estate = read('../brands/estate.css')
const mobile = read('./mobile.css')

function declsBySelector(root) {
  const out = new Map()
  root.walkRules((rule) => {
    const props = rule.nodes.filter((n) => n.type === 'decl').map((d) => [d.prop, d.value])
    out.set(rule.selector.replace(/\s+/g, ' ').trim(), new Map(props))
  })
  return out
}
function allProps(root) {
  const s = new Set()
  root.walkDecls((d) => { if (d.prop.startsWith('--')) s.add(d.prop) })
  return s
}

const rules = declsBySelector(mobile)
const NEW_TOKENS = ['--touch-target', '--density-pad-x', '--density-pad-y', '--density-gap', '--page-gutter', '--tabbar-height']
const RETUNED = ['--font-size-base', '--fs-2xs', '--fs-xs', '--fs-sm', '--fs-md', '--fs-lg', '--fs-xl', '--fs-2xl', '--fs-3xl', '--fs-4xl']
const BTN = ['--eui-btn-h-xs', '--eui-btn-h-sm', '--eui-btn-h-md', '--eui-btn-h-lg']

describe('platforms/mobile.css', () => {
  it('declares exactly these rule blocks', () => {
    expect([...rules.keys()]).toEqual([
      ':root, [data-platform="desktop"]',
      '[data-platform="mobile"]',
      '[data-platform="mobile"] .eui-btn',
      '[data-platform="desktop"]',
      '[data-platform="desktop"] .eui-btn',
    ])
  })

  it('reaches :root only with tokens that no 5.3.0 file declares', () => {
    const before = new Set([...allProps(base), ...allProps(aec), ...allProps(estate)])
    const rootBlock = rules.get(':root, [data-platform="desktop"]')
    expect([...rootBlock.keys()]).toEqual(NEW_TOKENS)
    for (const t of NEW_TOKENS) expect(before.has(t)).toBe(false)
  })

  it('re-tunes existing tokens only under a data-platform attribute', () => {
    expect([...rules.get('[data-platform="mobile"]').keys()]).toEqual([...NEW_TOKENS, ...RETUNED])
    expect([...rules.get('[data-platform="mobile"] .eui-btn').keys()]).toEqual(BTN)
    expect([...rules.get('[data-platform="desktop"]').keys()]).toEqual(RETUNED)
    expect([...rules.get('[data-platform="desktop"] .eui-btn').keys()]).toEqual(BTN)
  })

  it('restates the exact 5.3.0 values under data-platform="desktop"', () => {
    const aecRoot = declsBySelector(aec).get(':root, [data-brand="aec"]')
    const desktop = rules.get('[data-platform="desktop"]')
    for (const t of RETUNED) expect(desktop.get(t)).toBe(aecRoot.get(t))
    const btn = declsBySelector(base).get('.eui-btn')
    const desktopBtn = rules.get('[data-platform="desktop"] .eui-btn')
    for (const t of BTN) expect(desktopBtn.get(t)).toBe(btn.get(t))
  })

  it('is density only: no colour, shadow or font-family values', () => {
    mobile.walkDecls((d) => {
      expect(d.value).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|var\(--(brand|gray)-/i)
      expect(d.prop).not.toMatch(/color|shadow|font-family|^--(bg|fg|border|action|brand|gray|primary|sidebar)/)
    })
  })

  it('mobile touch targets never drop below 44px', () => {
    expect(parseInt(rules.get(':root, [data-platform="desktop"]').get('--touch-target'), 10)).toBeGreaterThanOrEqual(44)
    expect(parseInt(rules.get('[data-platform="mobile"]').get('--touch-target'), 10)).toBeGreaterThanOrEqual(44)
  })

  it('no brand file declares a density token (they would shadow the platform axis)', () => {
    for (const root of [aec, estate]) {
      const props = allProps(root)
      for (const t of NEW_TOKENS) expect(props.has(t)).toBe(false)
    }
    // estate.css must not re-tune the type scale either
    for (const t of RETUNED) expect(allProps(estate).has(t)).toBe(false)
  })
})
