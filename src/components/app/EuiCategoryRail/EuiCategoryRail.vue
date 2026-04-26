<script setup>
defineOptions({ name: 'EuiCategoryRail' })

defineProps({
  categories: { type: Array, required: true },
  selected: { type: String, default: null },
  phaseLabel: { type: String, default: '' },
})
const emit = defineEmits(['select', 'add'])
</script>

<template>
  <aside class="w-[260px] border-r border-border bg-card/50 flex-shrink-0 overflow-y-auto">
    <div class="px-4 py-2.5 border-b border-border">
      <div class="flex items-center justify-between">
        <h4 class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Categories</h4>
        <button class="text-[10px] text-primary" @click="emit('add')">+ Add</button>
      </div>
      <p v-if="phaseLabel" class="text-[11px] text-foreground mt-1">{{ phaseLabel }}</p>
    </div>
    <button
      v-for="c in categories"
      :key="c.name"
      class="w-full text-left px-3 py-2.5 flex items-start gap-2.5 border-l-[3px] hover:bg-muted/50"
      :class="selected === c.name ? 'bg-primary/10 border-primary' : 'border-transparent'"
      @click="emit('select', c)"
    >
      <span class="size-7 shrink-0 rounded-md bg-muted text-[10px] font-bold flex items-center justify-center">
        {{ (c.label || '').slice(0, 2).toUpperCase() }}
      </span>
      <span class="flex-1 min-w-0">
        <span class="block text-sm font-medium truncate">{{ c.label }}</span>
        <span class="block text-[10px] text-muted-foreground mt-0.5">
          {{ c.item_count || 0 }} items
          <span v-if="c.approved_count">· {{ c.approved_count }} approved</span>
        </span>
      </span>
    </button>
  </aside>
</template>
