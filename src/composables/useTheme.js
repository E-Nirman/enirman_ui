import { ref, watch, onMounted } from 'vue'

/*
 * useTheme — single source of truth for light/dark switching.
 *
 * - Persists to localStorage under 'enirman_theme'
 * - Falls back to prefers-color-scheme on first load
 * - Sets data-theme="dark" on <html>, which every design-system
 *   component keys off via CSS variables
 */

const STORAGE_KEY = 'enirman_theme'
const theme = ref('light')  // shared across all callers

function apply(value) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', value)
}

export function useTheme() {
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      theme.value = stored
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    apply(theme.value)
  })

  watch(theme, (v) => {
    localStorage.setItem(STORAGE_KEY, v)
    apply(v)
  })

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  function setTheme(v) {
    if (v === 'light' || v === 'dark') theme.value = v
  }
  const isDark = () => theme.value === 'dark'

  return { theme, isDark, toggle, setTheme }
}
