import { ref, computed, onMounted, onUnmounted } from 'vue'

const BP = { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }

export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)

  const onResize = () => { width.value = window.innerWidth }
  onMounted(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
  })
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return {
    width,
    isMobile:  computed(() => width.value < BP.md),
    isTablet:  computed(() => width.value >= BP.md && width.value < BP.lg),
    isDesktop: computed(() => width.value >= BP.lg),
    BP,
  }
}
