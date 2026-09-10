import { ref, watch, onMounted } from 'vue'

/*
 * useTheme — light/dark switch shared across all consumer apps, plus
 * (5.3.0) the brand axis.
 *
 * Theme: sets data-theme="dark" on <html>, which every design-system
 * token keys off. Persists to localStorage so user choice survives
 * reloads.
 *
 * Default order:
 *   1. localStorage (if user has chosen)
 *   2. prefers-color-scheme (system preference)
 *   3. 'light' fallback
 *
 * Brand: sets data-brand="aec" | "estate" on <html>. Orthogonal to the
 * theme — a separate ref, a separate storage key, and setting one never
 * touches the other. Default is 'aec', which renders exactly what
 * consumers got before the brand axis existed.
 */

const STORAGE_KEY = 'enirman_theme'
const BRAND_STORAGE_KEY = 'enirman-brand'   // deliberately not the theme key
const BRANDS = ['aec', 'estate']

const theme = ref('light')
const brand = ref('aec')

function apply(value) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', value)
  document.documentElement.classList.toggle('dark', value === 'dark')
}

function applyBrand(value) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-brand', value)
}

function setBrand(v) {
  if (v !== 'aec' && v !== 'estate') return
  brand.value = v
  applyBrand(v)
  try { localStorage.setItem(BRAND_STORAGE_KEY, v) } catch { /* ignore */ }
}

export function useTheme() {
  onMounted(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') {
        theme.value = stored
      } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        theme.value = 'dark'
      }
    } catch { /* ignore */ }
    apply(theme.value)

    try {
      const storedBrand = localStorage.getItem(BRAND_STORAGE_KEY)
      if (BRANDS.includes(storedBrand)) brand.value = storedBrand
    } catch { /* ignore */ }
    applyBrand(brand.value)
  })

  watch(theme, (v) => {
    try { localStorage.setItem(STORAGE_KEY, v) } catch {}
    apply(v)
  })

  return {
    theme,
    isDark: () => theme.value === 'dark',
    toggle: () => (theme.value = theme.value === 'dark' ? 'light' : 'dark'),
    setTheme: (v) => {
      if (v === 'light' || v === 'dark') theme.value = v
    },
    brand,
    setBrand,
  }
}
