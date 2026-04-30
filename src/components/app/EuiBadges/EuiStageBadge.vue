<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiStageBadge' })

/*
 * EuiStageBadge — RIBA stage code chip (S0…S7).
 *
 * Compact, monospace code on the brand info palette so it reads as a
 * structured identifier rather than a status. Pass an object form
 * `{code, label}` to surface the full label inline.
 */

const props = defineProps({
  stage:     { type: [String, Object], required: true },
  showLabel: { type: Boolean, default: false },
})

const code  = computed(() => typeof props.stage === 'string' ? props.stage : props.stage?.code)
const label = computed(() => typeof props.stage === 'object' ? props.stage?.label : null)
</script>

<template>
  <span
    class="inline-flex h-[22px] items-center gap-1 rounded-pill bg-info-muted px-2 text-2xs font-bold text-info-ink whitespace-nowrap"
    :title="label || code"
  >
    <span class="font-mono">{{ code }}</span><template v-if="showLabel && label"><span class="opacity-70">·</span> {{ label }}</template>
  </span>
</template>
