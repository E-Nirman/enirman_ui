<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiKanbanCard' })

const props = defineProps({ card: { type: Object, required: true } })

// Priority bar — colored 4px vertical strip at the left of the card.
// Inferred from due_date proximity if no explicit priority field.
const priorityTone = computed(() => {
  const p = (props.card.priority || '').toLowerCase()
  if (p === 'high' || p === 'critical' || p === 'urgent') return 'bg-red-500'
  if (p === 'medium' || p === 'med') return 'bg-amber-500'
  if (p === 'low') return 'bg-slate-400'
  // Heuristic: due_date passed → high; within 2 days → medium
  if (props.card.due_date) {
    const due = new Date(props.card.due_date)
    const days = (due - new Date()) / 86400000
    if (days < 0) return 'bg-red-500'
    if (days < 2) return 'bg-amber-500'
  }
  return 'bg-slate-400'
})

function onDragStart(e) {
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.name)
}
</script>

<template>
  <article
    class="grid grid-cols-[4px_1fr] gap-2 bg-card border border-border rounded-md cursor-grab text-[14px] hover:border-foreground/30 transition-colors overflow-hidden"
    draggable="true"
    :data-name="card.name"
    @dragstart="onDragStart"
  >
    <!-- priority bar -->
    <span :class="['rounded-l-md', priorityTone]"></span>

    <div class="py-2 pr-2 min-w-0">
      <div class="font-mono text-muted-foreground text-[11.5px] flex items-center gap-2">
        <span class="truncate">{{ card.display_id }}</span>
        <span v-if="card.rev" class="bg-muted px-1 rounded text-foreground/80 shrink-0">Rev {{ card.rev }}</span>
      </div>
      <div class="font-medium truncate mt-0.5 text-[13px] leading-tight">{{ card.title }}</div>
      <div class="flex items-center justify-between mt-2 text-[11px] text-muted-foreground gap-2">
        <span v-if="card.discipline"
              class="font-mono px-1.5 py-0.5 rounded bg-muted text-foreground/70 uppercase tracking-wide shrink-0">
          {{ card.discipline }}
        </span>
        <span v-else>—</span>
        <span class="truncate">{{ card.assigned_to || 'Unassigned' }}</span>
      </div>
    </div>
  </article>
</template>
