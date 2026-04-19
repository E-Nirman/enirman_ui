<script setup>
import { ComboboxRoot } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  searchTerm:  { type: String, default: '' },
  class:       { type: [String, Array, Object], default: '' },
})
const emits = defineEmits(['update:modelValue', 'update:searchTerm'])
</script>

<template>
  <ComboboxRoot
    :model-value="modelValue"
    :search-term="searchTerm"
    :filter-function="() => $slots.default ? [] : []"
    open
    @update:model-value="emits('update:modelValue', $event)"
    @update:search-term="emits('update:searchTerm', $event)"
    :class="cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', props.class)"
  >
    <slot />
  </ComboboxRoot>
</template>
