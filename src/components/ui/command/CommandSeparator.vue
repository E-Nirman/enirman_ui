<script setup>
import { ComboboxSeparator } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <ComboboxSeparator :class="cn('-mx-1 h-px bg-border', props.class)" />
</template>
