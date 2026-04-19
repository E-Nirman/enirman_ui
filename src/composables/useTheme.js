import { ref, watch, onMounted } from 'vue'

/*
 * useTheme — light/dark switch shared across all consumer apps.
 *
 * Sets data-theme="dark" on <html>, which every design-system token
 * keys off. Persists to localStorage so user choice survives reloads.
 *
 * Default order:
 *   1. localStorage (if user has chosen)
 *   2. prefers-color-scheme (system preference)
 *   3. 'light' fallback
 */

const STORAGE_KEY = 'enirman_theme'
const theme = ref('light')

function apply(value) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', value)
  document.documentElement.classList.toggle('dark', value === 'dark')
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
  }
}
