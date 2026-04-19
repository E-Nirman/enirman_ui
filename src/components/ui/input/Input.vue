<script setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type:       { type: String, default: 'text' },
  disabled:   { type: Boolean, default: false },
  class:      { type: [String, Array, Object], default: '' },
})
const emits = defineEmits(['update:modelValue'])
const modelValue = useVModel(props, 'modelValue', emits, { passive: true, defaultValue: props.modelValue })
</script>

<template>
  <input
    v-model="modelValue"
    :type="type"
    :disabled="disabled"
    :class="cn(
      'flex h-8.5 w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm shadow-sm',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-transparent',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors',
      props.class,
    )"
  />
</template>

<style scoped>
.h-8\.5 { height: 2.125rem; }
</style>
