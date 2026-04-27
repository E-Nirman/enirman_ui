<script setup>
defineProps({ markups: { type: Array, default: () => [] } })
defineEmits(['select'])
</script>
<template>
  <div class="absolute inset-0 pointer-events-none"></div>
</template>
