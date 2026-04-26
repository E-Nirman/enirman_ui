<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiStatCard' })

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  delta: { type: String, default: null },
  sub: { type: String, default: null },
})

const deltaClass = computed(() => {
  if (!props.delta) return ''
  if (props.delta.startsWith('+')) return 'text-success'
  if (props.delta.startsWith('-') || props.delta.startsWith('−')) return 'text-destructive'
  return 'text-muted-foreground'
})
</script>

<template>
  <div class="bg-card border border-border first:rounded-l-lg last:rounded-r-lg p-4">
    <div class="text-[11.5px] text-muted-foreground font-medium mb-1.5">{{ label }}</div>
    <div class="flex items-baseline gap-2">
      <div class="text-[22px] font-bold tracking-tight text-foreground leading-none">{{ value }}</div>
      <div v-if="delta" class="text-[11px] font-medium font-mono" :class="deltaClass">{{ delta }}</div>
    </div>
    <div v-if="sub" class="text-[11.5px] text-muted-foreground/70 mt-1.5">{{ sub }}</div>
  </div>
</template>
