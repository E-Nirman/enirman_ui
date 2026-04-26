<script setup>
import { computed } from 'vue'
import EuiDesignItemCard from '../EuiDesignItemCard/EuiDesignItemCard.vue'

defineOptions({ name: 'EuiDesignItemList' })

const props = defineProps({
  items: { type: Array, required: true },
  selected: { type: String, default: null },
  category: { type: Object, default: null },
  phaseLabel: { type: String, default: '' },
})
const emit = defineEmits(['select', 'add'])

// Auto-group by block when ≥2 distinct blocks present
const groupedByBlock = computed(() => {
  const map = new Map()
  for (const item of props.items) {
    const key = item.block?.name || '__none__'
    if (!map.has(key)) map.set(key, { block: item.block || null, items: [] })
    map.get(key).items.push(item)
  }
  return [...map.values()]
})

const showSubheaders = computed(() => groupedByBlock.value.length >= 2)
</script>

<template>
  <main class="flex-1 overflow-y-auto min-w-0">
    <div class="px-5 py-3 border-b border-border flex items-center justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{{ phaseLabel }}</span>
          <span>›</span>
          <span class="text-foreground font-medium">{{ category?.label }}</span>
        </div>
        <div class="text-xs text-muted-foreground mt-0.5">{{ items.length }} items</div>
      </div>
      <button
        class="rounded-md bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5"
        @click="emit('add')"
      >+ Add Design Item</button>
    </div>
    <div class="p-4 space-y-3">
      <template v-for="group in groupedByBlock" :key="group.block?.name || '__none__'">
        <div v-if="showSubheaders" class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-muted-foreground/50" />
          {{ group.block?.block_name || 'Project-wide' }} · {{ group.items.length }} items
        </div>
        <div class="space-y-2">
          <EuiDesignItemCard
            v-for="item in group.items"
            :key="item.name"
            :item="item"
            :selected="selected === item.name"
            @click="emit('select', item)"
          />
        </div>
      </template>
    </div>
  </main>
</template>
