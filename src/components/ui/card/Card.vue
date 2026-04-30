<script setup>
import { cn } from '../../../lib/utils.js'

/*
 * Card — neutral elevated surface (8px radius, 1px subtle border,
 * navy-tinted --shadow-sm). Use `<Card class="shadow-md">` to lift
 * for hover / focus surfaces; `class="border-0 shadow-none"` for
 * embedded sub-cards.
 */

const props = defineProps({
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div :class="cn('rounded-lg border border-border-subtle bg-card text-card-foreground shadow-sm', props.class)">
    <slot />
  </div>
</template>
