<script setup>
import { useVModel } from '@vueuse/core'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  disabled:   { type: Boolean, default: false },
  rows:       { type: [Number, String], default: 3 },
  class:      { type: [String, Array, Object], default: '' },
})
const emits = defineEmits(['update:modelValue'])
const modelValue = useVModel(props, 'modelValue', emits, { passive: true, defaultValue: props.modelValue })
</script>

<template>
  <textarea
    v-model="modelValue"
    :disabled="disabled"
    :rows="rows"
    :class="cn(
      'flex w-full rounded-md border border-input bg-card text-sm text-foreground shadow-xs',
      'px-2.5 py-2 min-h-[72px]',
      'placeholder:text-muted-foreground',
      'transition-[border-color,box-shadow] duration-fast ease-out-expo',
      'focus-visible:outline-none focus-visible:border-ring focus-visible:shadow-focus',
      'aria-[invalid=true]:border-destructive aria-[invalid=true]:shadow-[0_0_0_3px_hsl(var(--destructive)/0.18)]',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
      'resize-y',
      props.class,
    )"
  />
</template>
