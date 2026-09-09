import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'

/*
 * useTheme keeps module-level refs, so every test re-imports a fresh
 * module (vi.resetModules) and mounts a throwaway component to run the
 * composable's onMounted hook the way a consumer app would.
 */
async function mountTheme() {
  vi.resetModules()
  const { useTheme } = await import('./useTheme.js')
  let api
  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp({
    setup() {
      api = useTheme()
      return () => h('div')
    },
  })
  app.mount(el)
  await nextTick()
  return api
}

const html = () => document.documentElement

beforeEach(() => {
  localStorage.clear()
  html().removeAttribute('data-theme')
  html().removeAttribute('data-brand')
  html().classList.remove('dark')
})

describe('useTheme — theme axis (unchanged behaviour)', () => {
  it('defaults to light and applies data-theme on mount', async () => {
    const { theme } = await mountTheme()
    expect(theme.value).toBe('light')
    expect(html().getAttribute('data-theme')).toBe('light')
    expect(html().classList.contains('dark')).toBe(false)
  })

  it('restores the theme from enirman_theme on mount', async () => {
    localStorage.setItem('enirman_theme', 'dark')
    const { theme } = await mountTheme()
    expect(theme.value).toBe('dark')
    expect(html().getAttribute('data-theme')).toBe('dark')
    expect(html().classList.contains('dark')).toBe(true)
  })

  it('setTheme ignores unknown values', async () => {
    const { theme, setTheme } = await mountTheme()
    setTheme('sepia')
    await nextTick()
    expect(theme.value).toBe('light')
    expect(html().getAttribute('data-theme')).toBe('light')
  })
})

describe('useTheme — brand axis', () => {
  it('defaults to aec and applies data-brand on mount', async () => {
    const { brand } = await mountTheme()
    expect(brand.value).toBe('aec')
    expect(html().getAttribute('data-brand')).toBe('aec')
  })

  it('restores the brand from its own storage key on mount', async () => {
    localStorage.setItem('enirman-brand', 'estate')
    const { brand } = await mountTheme()
    expect(brand.value).toBe('estate')
    expect(html().getAttribute('data-brand')).toBe('estate')
  })

  it('setBrand("estate") sets the attribute and persists under enirman-brand', async () => {
    const { brand, setBrand } = await mountTheme()
    setBrand('estate')
    expect(brand.value).toBe('estate')
    expect(html().getAttribute('data-brand')).toBe('estate')
    expect(localStorage.getItem('enirman-brand')).toBe('estate')
  })

  it('setBrand does not change the theme value or the theme storage key', async () => {
    const { theme, setTheme, setBrand } = await mountTheme()
    setTheme('light')
    await nextTick()
    const themeBefore = theme.value
    const themeStorageBefore = localStorage.getItem('enirman_theme')
    const themeAttrBefore = html().getAttribute('data-theme')

    setBrand('estate')
    await nextTick()

    expect(theme.value).toBe(themeBefore)
    expect(localStorage.getItem('enirman_theme')).toBe(themeStorageBefore)
    expect(html().getAttribute('data-theme')).toBe(themeAttrBefore)
    expect(html().classList.contains('dark')).toBe(false)
    // and the two axes really do use different keys
    expect(localStorage.getItem('enirman-brand')).toBe('estate')
    expect('enirman-brand').not.toBe('enirman_theme')
  })

  it('setTheme does not change the brand value or the brand storage key', async () => {
    const { theme, brand, setTheme, setBrand } = await mountTheme()
    setBrand('estate')
    setTheme('dark')
    await nextTick()

    expect(theme.value).toBe('dark')
    expect(html().getAttribute('data-theme')).toBe('dark')
    expect(brand.value).toBe('estate')
    expect(html().getAttribute('data-brand')).toBe('estate')
    expect(localStorage.getItem('enirman-brand')).toBe('estate')
    expect(localStorage.getItem('enirman_theme')).toBe('dark')
  })

  it('setting an unknown brand is a no-op', async () => {
    const { brand, setBrand } = await mountTheme()
    for (const bad of ['studio', 'AEC', '', null, undefined, 42]) {
      setBrand(bad)
      expect(brand.value).toBe('aec')
      expect(html().getAttribute('data-brand')).toBe('aec')
      expect(localStorage.getItem('enirman-brand')).toBeNull()
    }
  })

  it('an unknown value in storage falls back to aec', async () => {
    localStorage.setItem('enirman-brand', 'studio')
    const { brand } = await mountTheme()
    expect(brand.value).toBe('aec')
    expect(html().getAttribute('data-brand')).toBe('aec')
  })
})
