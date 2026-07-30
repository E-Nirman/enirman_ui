<script setup>
defineOptions({ name: 'EuiKanbanCard' })

const props = defineProps({
  dragId: { type: String, required: true },
})

function onDragStart(e) {
  e.dataTransfer.setData('text/plain', props.dragId)
}
</script>

<template>
  <article
    class="bg-card border border-border rounded-md cursor-grab text-[14px] hover:border-foreground/30 transition-colors overflow-hidden p-2"
    draggable="true"
    @dragstart="onDragStart"
  >
    <slot />
  </article>
</template>
