<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <td :class="cn('p-3 align-middle [&:has([role=checkbox])]:pr-0', props.class)">
    <slot />
  </td>
</template>
