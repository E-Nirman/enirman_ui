<script setup>
import { computed } from 'vue'
import EuiStageBadge from '../EuiBadges/EuiStageBadge.vue'
import EuiDesignItemCard from '../EuiDesignItemCard/EuiDesignItemCard.vue'
import { Badge } from '../../ui/badge'

defineOptions({ name: 'EuiPhaseKanban' })

const props = defineProps({
  phases: { type: Array, required: true },
  categories: { type: Array, required: true },
  items: { type: Array, required: true },
})
const emit = defineEmits(['select-item', 'add-item'])

// Group items by (phase, category)
const grouped = computed(() => {
  const result = props.phases.map(p => ({
    phase: p,
    categoryColumns: props.categories
      .filter(c => c.default_phase === p.name)
      .map(c => ({
        category: c,
        items: props.items.filter(i => i.project_phase === p.name && i.design_category === c.name),
      })),
  }))
  return result.filter(r => r.categoryColumns.length > 0 || props.items.some(i => i.project_phase === r.phase.name))
})

function statusBorder(status) {
  if (status === 'Approved') return 'border-t-4 border-t-success'
  if (status === 'In Review') return 'border-t-4 border-t-warning'
  if (status === 'In Progress') return 'border-t-4 border-t-primary'
  return 'border-t-4 border-t-muted-foreground/30'
}
</script>

<template>
  <div class="flex gap-3 overflow-x-auto p-4 h-full">
    <div
      v-for="g in grouped"
      :key="g.phase.name"
      class="flex flex-col rounded-lg border border-border bg-card flex-shrink-0"
      :class="statusBorder(g.phase.status)"
    >
      <header class="p-3 border-b border-border">
        <div class="flex items-center gap-2">
          <EuiStageBadge :stage="g.phase.riba_stage" />
          <h3 class="font-semibold text-sm flex-1 truncate">{{ g.phase.phase_name }}</h3>
          <Badge variant="outline" class="text-[10px]">{{ g.phase.status }}</Badge>
        </div>
        <p class="text-[10px] text-muted-foreground mt-0.5">{{ g.categoryColumns.length }} categories</p>
      </header>
      <div class="flex divide-x divide-border flex-1 min-h-0">
        <div
          v-for="col in g.categoryColumns"
          :key="col.category.name"
          class="w-[230px] flex-shrink-0 flex flex-col min-h-0"
        >
          <div class="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
            <span class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold truncate">{{ col.category.label }}</span>
            <span class="text-[10px] text-muted-foreground">{{ col.items.length }}</span>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-2">
            <EuiDesignItemCard
              v-for="item in col.items"
              :key="item.name"
              :item="item"
              density="compact"
              @click="emit('select-item', item)"
            />
            <button
              v-if="col.items.length === 0"
              class="w-full text-xs text-muted-foreground border border-dashed border-border rounded py-2 hover:border-primary"
              @click="emit('add-item', { phase: g.phase, category: col.category })"
            >+ add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
