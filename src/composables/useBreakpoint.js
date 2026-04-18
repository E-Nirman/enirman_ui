import { ref, onMounted, onUnmounted, computed } from 'vue'

/*
 * useBreakpoint — reactive viewport breakpoint.
 *
 * Breakpoints match Tailwind defaults + our xs extension:
 *   xs:  >= 480
 *   sm:  >= 640
 *   md:  >= 768
 *   lg:  >= 1024
 *   xl:  >= 1280
 *   2xl: >= 1536
 *
 * Use `isMobile` / `isTablet` / `isDesktop` convenience flags for common
 * responsive branching (e.g. sidebar drawer vs persistent).
 */

const BREAKPOINTS = { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

  function onResize() { width.value = window.innerWidth }

  onMounted(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
  })
  onUnmounted(() => window.removeEventListener('resize', onResize))

  const isMobile  = computed(() => width.value < BREAKPOINTS.md)
  const isTablet  = computed(() => width.value >= BREAKPOINTS.md && width.value < BREAKPOINTS.lg)
  const isDesktop = computed(() => width.value >= BREAKPOINTS.lg)

  return { width, isMobile, isTablet, isDesktop, BREAKPOINTS }
}
