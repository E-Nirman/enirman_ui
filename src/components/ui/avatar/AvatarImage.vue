<script setup>
import { AvatarImage as RekaAvatarImage } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  src:   { type: String, required: true },
  alt:   { type: String, default: '' },
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <RekaAvatarImage :src="src" :alt="alt" :class="cn('aspect-square h-full w-full object-cover', props.class)" />
</template>
