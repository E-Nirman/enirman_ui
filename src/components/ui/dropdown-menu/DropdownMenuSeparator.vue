<script setup>
import { DropdownMenuSeparator as RekaSeparator } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <RekaSeparator :class="cn('-mx-1 my-1 h-px bg-border', props.class)" />
</template>
