<script setup>
import EuiStageBadge from '../EuiBadges/EuiStageBadge.vue'

defineOptions({ name: 'EuiPhaseRail' })

defineProps({
  phases: { type: Array, required: true },
  selected: { type: String, default: null },
})
const emit = defineEmits(['select', 'add'])
</script>

<template>
  <aside class="w-[230px] border-r border-border bg-muted/30 flex-shrink-0 overflow-y-auto">
    <div class="px-4 py-2.5 border-b border-border flex items-center justify-between">
      <h4 class="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Phases · {{ phases.length }}</h4>
      <button class="text-[10px] text-primary" @click="emit('add')">+ Add</button>
    </div>
    <button
      v-for="p in phases"
      :key="p.name"
      class="w-full text-left px-3 py-2.5 flex items-start gap-2.5 border-l-[3px] hover:bg-muted/50"
      :class="selected === p.name ? 'bg-primary/10 border-primary' : 'border-transparent'"
      @click="emit('select', p)"
    >
      <EuiStageBadge :stage="p.riba_stage" />
      <span class="flex-1 min-w-0">
        <span class="block text-sm font-medium truncate">{{ p.phase_name }}</span>
        <span class="block text-[10px] text-muted-foreground mt-0.5">{{ p.status }} · {{ p.item_count || 0 }}</span>
      </span>
    </button>
  </aside>
</template>
