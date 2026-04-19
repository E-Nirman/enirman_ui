<script setup>
import { ref } from 'vue'
import { cn } from '../lib/utils.js'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  label:       { type: String, default: '' },
  collapsed:   { type: Boolean, default: false },
  collapsible: { type: Boolean, default: false },
  defaultExpanded: { type: Boolean, default: true },
  class:       { type: [String, Array, Object], default: '' },
})

const expanded = ref(props.defaultExpanded || !props.collapsible)
function toggle() { if (props.collapsible) expanded.value = !expanded.value }
</script>

<template>
  <div :class="cn('flex flex-col gap-0.5 py-2', props.class)">
    <button
      v-if="!collapsed && label"
      type="button"
      :disabled="!collapsible"
      :class="cn(
        'mx-3 flex h-6 items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted',
        collapsible ? 'cursor-pointer hover:text-sidebar-foreground' : 'cursor-default',
      )"
      @click="toggle"
    >
      <span>{{ label }}</span>
      <ChevronDown
        v-if="collapsible"
        :class="cn('size-3 transition-transform', expanded ? '' : '-rotate-90')"
      />
    </button>

    <div v-if="collapsed || expanded" class="flex flex-col gap-0.5">
      <slot />
    </div>
  </div>
</template>
