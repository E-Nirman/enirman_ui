<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiPriorityMark' })

const props = defineProps({
  priority: { type: String, default: 'none' },
})

const cls = computed(() => ({
  high:   'bg-destructive',
  medium: 'bg-warning',
  med:    'bg-warning',
  low:    'bg-muted-foreground/70',
  none:   'bg-muted-foreground/30',
})[props.priority] || 'bg-muted-foreground/30')
</script>

<template>
  <span class="inline-block w-1 h-8 rounded-full" :class="cls" />
</template>
