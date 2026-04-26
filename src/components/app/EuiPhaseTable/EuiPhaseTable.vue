<script setup>
import { computed } from 'vue'
import EuiStageBadge from '../EuiBadges/EuiStageBadge.vue'
import EuiBlockBadge from '../EuiBadges/EuiBlockBadge.vue'
import { Badge } from '../../ui/badge'

defineOptions({ name: 'EuiPhaseTable' })

const props = defineProps({
  phases: { type: Array, required: true },
  categories: { type: Array, required: true },
  items: { type: Array, required: true },
})
const emit = defineEmits(['select-item'])

const groupedRows = computed(() =>
  props.phases.map(p => ({
    phase: p,
    items: props.items.filter(i => i.project_phase === p.name),
  })).filter(g => g.items.length > 0)
)

function categoryLabel(name) {
  return props.categories.find(c => c.name === name)?.label || name
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-muted/50 text-muted-foreground text-xs">
        <tr>
          <th class="text-left px-3 py-2 font-medium">Item</th>
          <th class="text-left px-3 py-2 font-medium">Category</th>
          <th class="text-left px-3 py-2 font-medium">Block</th>
          <th class="text-left px-3 py-2 font-medium">Version</th>
          <th class="text-left px-3 py-2 font-medium">Status</th>
          <th class="text-left px-3 py-2 font-medium">Assigned</th>
          <th class="text-left px-3 py-2 font-medium">Updated</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="g in groupedRows" :key="g.phase.name">
          <tr class="bg-muted/20">
            <td colspan="7" class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <EuiStageBadge :stage="g.phase.riba_stage" class="mr-2" />
              {{ g.phase.phase_name }} ·
              <Badge variant="outline" class="ml-1 text-[10px]">{{ g.phase.status }}</Badge>
            </td>
          </tr>
          <tr
            v-for="item in g.items"
            :key="item.name"
            class="border-b border-border hover:bg-muted/30 cursor-pointer"
            @click="emit('select-item', item)"
          >
            <td class="px-3 py-2 font-medium">
              <Badge v-if="item.option_label" variant="primary" class="font-mono text-[9px] mr-1">{{ item.option_label }}</Badge>
              {{ item.title }}
            </td>
            <td class="px-3 py-2 text-muted-foreground">{{ categoryLabel(item.design_category) }}</td>
            <td class="px-3 py-2"><EuiBlockBadge :block="item.block" /></td>
            <td class="px-3 py-2 font-mono text-xs">{{ item.version_label }}</td>
            <td class="px-3 py-2"><Badge variant="outline" class="text-[10px]">{{ item.status }}</Badge></td>
            <td class="px-3 py-2 text-xs">{{ item.assigned_designer || '—' }}</td>
            <td class="px-3 py-2 text-xs text-muted-foreground">{{ item.modified }}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
