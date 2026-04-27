<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  trend: { type: String, default: '' },
  tone: { type: String, default: 'default' },
})
</script>
<template>
  <div class="p-4 rounded-md border border-border bg-card flex flex-col gap-1">
    <span class="text-[11px] uppercase tracking-wide text-muted-foreground">{{ label }}</span>
    <span class="text-2xl font-semibold font-mono">{{ value }}</span>
    <span v-if="trend" class="text-[11px] text-muted-foreground">{{ trend }}</span>
  </div>
</template>
