<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiBlockBadge' })

const props = defineProps({
  block: { type: Object, default: null }, // {name, block_name} or null for project-wide
})

const palette = computed(() => {
  if (!props.block) return { bg: 'rgba(148,163,184,.1)', fg: '#94a3b8', border: 'rgba(148,163,184,.25)' }
  const seed = props.block.name || ''
  const variants = [
    { bg: 'rgba(34,211,238,.12)',  fg: '#67e8f9', border: 'rgba(34,211,238,.3)' },  // cyan
    { bg: 'rgba(244,114,182,.12)', fg: '#f9a8d4', border: 'rgba(244,114,182,.3)' }, // pink
    { bg: 'rgba(168,85,247,.12)',  fg: '#d8b4fe', border: 'rgba(168,85,247,.3)' },  // violet
    { bg: 'rgba(251,191,36,.12)',  fg: '#fcd34d', border: 'rgba(251,191,36,.3)' },  // amber
  ]
  const idx = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % variants.length
  return variants[idx]
})

const text = computed(() => props.block?.block_name || 'Project-wide')
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
    :style="{ background: palette.bg, color: palette.fg, borderColor: palette.border }"
  >
    {{ text }}
  </span>
</template>
