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
  <div :class="cn('flex flex-col pt-2.5 pb-1', props.class)">
    <button
      v-if="!collapsed && label"
      type="button"
      :disabled="!collapsible"
      :class="cn(
        'mx-3 mb-1.5 flex h-5 items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-caps text-sidebar-foreground/55',
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

    <div v-if="collapsed || expanded" class="flex flex-col gap-px">
      <slot />
    </div>
  </div>
</template>
