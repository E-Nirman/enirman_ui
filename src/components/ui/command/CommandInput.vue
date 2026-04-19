<script setup>
import { ComboboxInput } from 'reka-ui'
import { Search } from 'lucide-vue-next'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  placeholder: { type: String, default: 'Search…' },
  class:       { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div class="flex items-center gap-2 border-b border-border px-3" cmdk-input-wrapper="">
    <Search class="size-4 shrink-0 text-muted-foreground" />
    <ComboboxInput
      :placeholder="placeholder"
      auto-focus
      :class="cn(
        'flex h-10 w-full bg-transparent py-2.5 text-sm outline-none',
        'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )"
    />
  </div>
</template>
