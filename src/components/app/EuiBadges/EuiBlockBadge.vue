<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiBlockBadge' })

/*
 * EuiBlockBadge — building / area / phase chip on the project canvas.
 *
 * Block name routes through a deterministic hash to one of four tone
 * families — keeps blocks visually separable on a busy table without
 * escaping the design system.
 *
 * Tones, not raw brand swatches: the -muted/-ink pairs are redefined under
 * [data-theme="dark"], so the chips re-tint. The previous brand-*-50
 * backgrounds did not flip and rendered as pale chips on the dark canvas.
 *
 * Four distinct hues — info / warning / success / neutral — matching the
 * discipline-tag convention in COMPONENTS.md. (`plus` is deliberately not
 * used: theme.css re-routes it to amber, so it would collide with
 * `warning`.)
 *
 * `null` block renders the muted "Project-wide" chip.
 */

const props = defineProps({
  block: { type: Object, default: null },
})

const ACCENTS = [
  { bg: 'hsl(var(--info-muted))',    fg: 'hsl(var(--info-ink))',         bd: 'hsl(var(--info) / 0.3)' },
  { bg: 'hsl(var(--warning-muted))', fg: 'hsl(var(--warning-ink))',      bd: 'hsl(var(--warning) / 0.3)' },
  { bg: 'hsl(var(--success-muted))', fg: 'hsl(var(--success-ink))',      bd: 'hsl(var(--success) / 0.3)' },
  { bg: 'hsl(var(--muted))',         fg: 'hsl(var(--muted-foreground))', bd: 'hsl(var(--border))' },
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
