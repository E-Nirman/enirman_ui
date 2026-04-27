<script setup>
defineProps({
  label: { type: String, required: true },
  count: { type: Number, default: 0 },
  color: { type: String, default: 'slate' },
})
defineEmits(['drop-card'])
</script>
<template>
  <section class="flex flex-col bg-muted/10 rounded-md min-w-[260px] max-w-[320px]">
    <header class="px-3 py-2 border-b border-border flex items-center gap-2">
      <span class="text-[12.5px] font-medium">{{ label }}</span>
      <span class="ml-auto font-mono text-[11px] text-muted-foreground">{{ count }}</span>
    </header>
    <div class="flex-1 overflow-y-auto p-2 space-y-2">
      <slot />
    </div>
  </section>
</template>
