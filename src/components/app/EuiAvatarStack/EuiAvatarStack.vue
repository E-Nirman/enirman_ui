<script setup>
import { computed } from 'vue'
import { cn } from '../../../lib/utils.js'

/*
 * EuiAvatarStack — overlapping circular initials.
 *
 * Used in tables (project teams, reviewers) and activity rows.
 * Auto-renders 2-letter initials from the supplied list and rotates
 * through the brand palette so adjacent avatars stay distinguishable
 * without depending on a configurable color prop.
 *
 * `max` clamps how many avatars render before showing a "+N" chip
 * with the remainder count. Tooltip on the +N reveals the full list.
 *
 * Props:
 *   names (string[])  — required, full names; first 2 letters initial
 *   max   (number)    — default 4, beyond which "+N" appears
 *   size  (sm|md|lg)  — 22 / 26 / 32 px
 */

const PALETTE = [
  'var(--brand-blue-500)',
  'var(--brand-amber-400)',
  'var(--brand-navy-500)',
  'var(--brand-blue-700)',
  'var(--brand-amber-600)',
]

const props = defineProps({
  names: { type: Array, required: true },
  max:   { type: Number, default: 4 },
  size:  { type: String, default: 'md' },
  class: { type: [String, Array, Object], default: '' },
})

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const visible = computed(() => props.names.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.names.length - props.max))

const sizeClasses = computed(() => ({
  sm: 'size-[22px] text-[9px] -ml-1.5 first:ml-0',
  md: 'size-[26px] text-[10px] -ml-2 first:ml-0',
  lg: 'size-[32px] text-xs -ml-2.5 first:ml-0',
}[props.size] || 'size-[26px] text-[10px] -ml-2 first:ml-0'))
</script>

<template>
  <div :class="cn('flex items-center', props.class)">
    <div
      v-for="(name, i) in visible"
      :key="i"
      :title="name"
      :class="[
        'inline-flex items-center justify-center rounded-pill text-white font-semibold tracking-tight',
        'ring-2 ring-card',
        sizeClasses,
      ]"
      :style="{ background: PALETTE[i % PALETTE.length] }"
    >{{ initials(name) }}</div>

    <div
      v-if="overflow"
      :title="names.slice(max).join(', ')"
      :class="[
        'inline-flex items-center justify-center rounded-pill bg-muted text-muted-foreground font-semibold tabular-nums',
        'ring-2 ring-card',
        sizeClasses,
      ]"
    >+{{ overflow }}</div>
  </div>
</template>
