<script setup>
import { computed } from 'vue'
import { Badge } from '../../ui/badge'

defineOptions({ name: 'EuiHandoffCard' })

const props = defineProps({
  handoff: { type: Object, required: true },
  showActions: { type: Boolean, default: true },
})
const emit = defineEmits(['accept', 'return', 'view'])

const statusVariant = computed(() => ({
  'Pending':  'warning',
  'Accepted': 'success',
  'Returned': 'destructive',
})[props.handoff.handoff_status] || 'default')
</script>

<template>
  <div class="rounded-md border border-border bg-card p-3">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
          <Badge :variant="statusVariant" class="text-[10px]">{{ handoff.handoff_status }}</Badge>
          <Badge variant="outline" class="text-[10px]">{{ handoff.from_discipline }} → {{ handoff.to_discipline }}</Badge>
          <Badge v-if="handoff.item_count" variant="outline" class="text-[10px]">{{ handoff.item_count }} items</Badge>
        </div>
        <div class="text-sm font-medium">From {{ handoff.from_user }} → {{ handoff.to_user }}</div>
        <div class="text-xs text-muted-foreground mt-0.5">
          {{ handoff.dpr }}<span v-if="handoff.phase"> · phase {{ handoff.phase }}</span><span v-if="handoff.creation"> · {{ handoff.creation }}</span>
        </div>
      </div>
      <div v-if="showActions && handoff.handoff_status === 'Pending'" class="flex gap-1.5 shrink-0">
        <button class="rounded bg-success/10 text-success border border-success/40 text-xs font-medium px-3 py-1.5"
                @click="emit('accept', handoff)">Accept</button>
        <button class="rounded bg-destructive/10 text-destructive border border-destructive/40 text-xs font-medium px-3 py-1.5"
                @click="emit('return', handoff)">Return</button>
      </div>
      <button v-else-if="showActions" class="rounded border border-border text-xs px-3 py-1.5"
              @click="emit('view', handoff)">View</button>
    </div>
  </div>
</template>
