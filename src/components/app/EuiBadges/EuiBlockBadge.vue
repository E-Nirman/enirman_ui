<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiBlockBadge' })

/*
 * EuiBlockBadge — building / area / phase chip on the project canvas.
 *
 * Block name routes through a deterministic hash to one of four brand
 * accent palettes (blue, amber, navy-2, blue-7) — keeps blocks visually
 * separable on a busy table without escaping the brand system.
 *
 * `null` block renders the muted "Project-wide" chip.
 */

const props = defineProps({
  block: { type: Object, default: null },
})

const ACCENTS = [
  { bg: 'var(--brand-blue-50)',  fg: 'var(--brand-blue-700)',  bd: 'var(--brand-blue-200)'  },
  { bg: 'var(--brand-amber-50)', fg: 'var(--brand-amber-700)', bd: 'var(--brand-amber-200)' },
  { bg: 'var(--brand-navy-50)',  fg: 'var(--brand-navy-700)',  bd: 'var(--brand-navy-200)'  },
  { bg: 'var(--gray-50)',        fg: 'var(--gray-700)',        bd: 'var(--gray-200)'        },
]

const palette = computed(() => {
  if (!props.block) {
    return { bg: 'hsl(var(--muted))', fg: 'hsl(var(--muted-foreground))', bd: 'hsl(var(--border))' }
  }
  const seed = props.block.name || ''
  const idx = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENTS.length
  return ACCENTS[idx]
})

const text = computed(() => props.block?.block_name || 'Project-wide')
</script>

<template>
  <span
    class="inline-flex h-[22px] items-center gap-1 rounded-pill border px-2 text-2xs font-semibold whitespace-nowrap"
    :style="{ background: palette.bg, color: palette.fg, borderColor: palette.bd }"
  >
    {{ text }}
  </span>
</template>
