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
    class="bg-card border border-border-default rounded-md cursor-grab text-base hover:border-foreground/30 transition-colors overflow-hidden p-2"
    draggable="true"
    @dragstart="onDragStart"
  >
    <slot />
  </article>
</template>
