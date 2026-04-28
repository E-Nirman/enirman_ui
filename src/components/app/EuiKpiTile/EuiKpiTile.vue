<script setup>
import { cn } from '../../../lib/utils.js'

defineOptions({ name: 'EuiKpiTile' })

defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  trend: { type: String, default: '' },
  tone:  { type: String, default: 'default' }, // 'default' | 'warning' | 'danger' | 'success' | 'info'
})
</script>

<template>
  <div class="p-4 rounded-md border border-border bg-card flex flex-col gap-1">
    <span class="text-[12.5px] uppercase tracking-wide text-muted-foreground">{{ label }}</span>
    <span
      :class="cn(
        'text-2xl font-semibold font-mono',
        tone === 'warning' && 'text-amber-500',
        tone === 'danger'  && 'text-destructive',
        tone === 'success' && 'text-emerald-500',
        tone === 'info'    && 'text-primary',
      )"
    >{{ value }}</span>
    <span v-if="trend" class="text-[12.5px] text-muted-foreground">{{ trend }}</span>
  </div>
</template>
