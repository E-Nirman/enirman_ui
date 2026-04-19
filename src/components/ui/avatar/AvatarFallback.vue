<script setup>
import { AvatarFallback as RekaAvatarFallback } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <RekaAvatarFallback :class="cn('flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground', props.class)">
    <slot />
  </RekaAvatarFallback>
</template>
