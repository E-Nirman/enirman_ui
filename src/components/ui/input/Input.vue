<script setup>
import { useVModel } from '@vueuse/core'
import { cn } from '../../../lib/utils.js'

/*
 * Input — text / number / email field.
 *
 * 32px height, 6px radius, 10px horizontal padding. Focus lifts the
 * border to blue 500 and adds a 3px blue-25% glow. Error state via
 * `aria-invalid="true"`: border + glow flip to danger red.
 */

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
      'flex h-8 w-full rounded-md border border-input bg-card text-sm text-foreground shadow-xs',
      'px-2.5 py-1',
      'placeholder:text-muted-foreground',
      'transition-[border-color,box-shadow] duration-fast ease-out-expo',
      'focus-visible:outline-none focus-visible:border-ring focus-visible:shadow-focus',
      'aria-[invalid=true]:border-destructive aria-[invalid=true]:shadow-[0_0_0_3px_hsl(var(--destructive)/0.18)]',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
      props.class,
    )"
  />
</template>
