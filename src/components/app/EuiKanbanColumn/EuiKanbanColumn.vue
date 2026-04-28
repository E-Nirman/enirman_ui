<script setup>
defineOptions({ name: 'EuiKanbanColumn' })

defineProps({
  label: { type: String, required: true },
  count: { type: Number, default: 0 },
  color: { type: String, default: 'slate' },
})
const emit = defineEmits(['drop-card'])

const colorMap = {
  slate:  'bg-slate-500',
  amber:  'bg-amber-500',
  blue:   'bg-blue-500',
  green:  'bg-emerald-500',
  red:    'bg-red-500',
}

function onDrop(e) {
  const id = e.dataTransfer?.getData('text/plain')
  if (id) emit('drop-card', id)
}
</script>

<template>
  <section
    class="flex flex-col bg-muted/10 rounded-md min-w-[260px] max-w-[320px]"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <header class="px-3 py-2 border-b border-border flex items-center gap-2">
      <span class="size-2 rounded-full" :class="colorMap[color] || 'bg-slate-500'"></span>
      <span class="text-[14px] font-medium">{{ label }}</span>
      <span class="ml-auto font-mono text-[12.5px] text-muted-foreground">{{ count }}</span>
    </header>
    <div class="flex-1 overflow-y-auto p-2 space-y-2">
      <slot />
    </div>
  </section>
</template>
