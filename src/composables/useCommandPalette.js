import { ref, onMounted, onUnmounted } from 'vue'

/*
 * useCommandPalette — global ⌘K / Ctrl+K registration.
 *
 * Returns a shared ref so any component in the tree can toggle the
 * palette. Pair with a root-level <CommandPalette v-model:open="..." />
 */

const open = ref(false)

function onKeyDown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
  if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

export function useCommandPalette() {
  onMounted(() => document.addEventListener('keydown', onKeyDown))
  onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
  return {
    open,
    toggle: () => (open.value = !open.value),
    close:  () => (open.value = false),
    show:   () => (open.value = true),
  }
}
