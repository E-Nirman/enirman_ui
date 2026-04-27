<script setup>
defineProps({ tr: { type: Object, default: null } })
</script>
<template>
  <div v-if="tr" class="bg-card border border-border rounded-md p-6 font-serif text-[12.5px]">
    <div class="text-lg font-bold">DOCUMENT TRANSMITTAL</div>
    <div class="text-muted-foreground font-mono">{{ tr.name }}</div>
  </div>
</template>
