<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiStatusFlow' })

const props = defineProps({
  statuses: { type: Array, required: true },
  current: { type: String, required: true },
})

const currentIdx = computed(() => props.statuses.indexOf(props.current))
</script>

<template>
  <div class="flex items-center gap-1.5 flex-wrap">
    <template v-for="(s, idx) in statuses" :key="s">
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border"
        :class="
          idx === currentIdx ? 'bg-warning/10 text-warning-foreground border-warning/40 font-semibold'
          : idx < currentIdx ? 'bg-success/10 text-success border-success/30'
          : 'bg-muted text-muted-foreground border-transparent'
        "
      >
        <span class="size-1.5 rounded-full" :style="{ background: 'currentColor' }" />
        {{ s }}
      </span>
      <svg v-if="idx < statuses.length - 1" class="size-3 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    </template>
  </div>
</template>
