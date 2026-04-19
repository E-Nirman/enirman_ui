<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <div :class="cn('flex items-center p-4 pt-0', props.class)">
    <slot />
  </div>
</template>
