<script setup>
import { computed } from 'vue'
defineOptions({ name: 'EuiMarkupPin' })
const props = defineProps({
  label: { type: [String, Number], default: '' },
  tone: { type: String, default: 'default' },
})
const tones = {
  default:  { bg: 'bg-destructive', shadow: 'shadow-[0_2px_8px_rgba(220,38,38,0.4)]' },
  resolved: { bg: 'bg-success',     shadow: 'shadow-[0_2px_8px_rgba(22,163,74,0.4)]' },
  info:     { bg: 'bg-primary',     shadow: 'shadow-[0_2px_8px_rgba(37,99,235,0.4)]' },
  amber:    { bg: 'bg-warning',     shadow: 'shadow-[0_2px_8px_rgba(217,119,6,0.4)]' },
}
const t = computed(() => tones[props.tone] || tones.default)
</script>

<template>
  <span
    class="inline-grid place-items-center w-[22px] h-[22px] text-white text-[11.5px] font-bold cursor-pointer transition-transform border-2 border-card hover:scale-110"
    style="border-radius: 50% 50% 50% 4px; transform: rotate(-45deg);"
    :class="[t.bg, t.shadow]"
  >
    <span style="transform: rotate(45deg);">{{ label }}</span>
  </span>
</template>
