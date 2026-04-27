<script setup>
defineProps({ tool: { type: String, default: 'select' } })
defineEmits(['update:tool'])
</script>
<template>
  <div class="absolute top-4 left-4 bg-card border border-border rounded-md p-1 shadow-sm"></div>
</template>
