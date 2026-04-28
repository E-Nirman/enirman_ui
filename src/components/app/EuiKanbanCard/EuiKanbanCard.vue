<script setup>
defineOptions({ name: 'EuiKanbanCard' })

defineProps({ card: { type: Object, required: true } })

function onDragStart(e) {
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.name)
}
</script>

<template>
  <article
    class="bg-card border border-border rounded-md p-2 cursor-grab text-[14px] hover:border-foreground/30 transition-colors"
    draggable="true"
    :data-name="card.name"
    @dragstart="onDragStart"
  >
    <div class="font-mono text-muted-foreground text-[12.5px] flex items-center gap-2">
      <span>{{ card.display_id }}</span>
      <span v-if="card.rev" class="bg-muted px-1 rounded">Rev {{ card.rev }}</span>
    </div>
    <div class="font-medium truncate mt-1">{{ card.title }}</div>
    <div class="flex items-center justify-between mt-2 text-[12.5px] text-muted-foreground">
      <span>{{ card.discipline || '—' }}</span>
      <span class="truncate ml-2">{{ card.assigned_to || 'Unassigned' }}</span>
    </div>
  </article>
</template>
