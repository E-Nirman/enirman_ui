<script setup>
import { MousePointer2, MapPin, Square, ArrowUpRight, Pencil } from 'lucide-vue-next'
import { cn } from '../../../lib/utils.js'

defineOptions({ name: 'EuiMarkupTools' })

const props = defineProps({ tool: { type: String, default: 'select' } })
const emit = defineEmits(['update:tool'])

const tools = [
  { key: 'select',    icon: MousePointer2, label: 'Select' },
  { key: 'pin',       icon: MapPin,        label: 'Pin' },
  { key: 'rectangle', icon: Square,        label: 'Rectangle' },
  { key: 'arrow',     icon: ArrowUpRight,  label: 'Arrow' },
  { key: 'freehand',  icon: Pencil,        label: 'Freehand' },
]
</script>

<template>
  <div class="absolute top-4 left-4 flex flex-col gap-1 bg-card border border-border rounded-md p-1 shadow-sm">
    <button
      v-for="t in tools" :key="t.key"
      :class="cn(
        'size-8 inline-flex items-center justify-center rounded',
        props.tool === t.key ? 'bg-foreground text-background' : 'hover:bg-accent'
      )"
      :title="t.label"
      @click="emit('update:tool', t.key)"
    >
      <component :is="t.icon" class="size-4" />
    </button>
  </div>
</template>
