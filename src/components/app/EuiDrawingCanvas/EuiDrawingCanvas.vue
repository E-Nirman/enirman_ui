<script setup>
defineProps({ src: { type: String, default: '' } })
</script>
<template>
  <div class="relative w-full h-full bg-muted/20 overflow-hidden">
    <slot />
  </div>
</template>
