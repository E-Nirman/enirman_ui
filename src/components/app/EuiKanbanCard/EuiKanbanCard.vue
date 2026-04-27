<script setup>
defineProps({ card: { type: Object, required: true } })
</script>
<template>
  <article class="bg-card border border-border rounded-md p-2 cursor-grab text-[12.5px]">
    <div class="font-mono text-muted-foreground text-[11px]">{{ card.display_id }}</div>
    <div class="font-medium truncate">{{ card.title }}</div>
  </article>
</template>
