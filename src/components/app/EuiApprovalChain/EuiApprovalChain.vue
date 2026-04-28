<script setup>
import { computed } from 'vue'
defineOptions({ name: 'EuiApprovalChain' })
defineProps({
  steps: { type: Array, required: true },
})
function markerClass(status) {
  return ({
    done:     'bg-success border-success text-success-foreground',
    current:  'bg-warning border-warning text-warning-foreground',
    rejected: 'bg-destructive border-destructive text-destructive-foreground',
    pending:  'bg-card border-border text-muted-foreground/60',
  })[status] || 'bg-card border-border text-muted-foreground/60'
}
function connectorClass(status) {
  return status === 'done' ? 'bg-success' : 'bg-border'
}
</script>

<template>
  <ol class="flex flex-col">
    <li v-for="(step, idx) in steps" :key="step.name + idx" class="relative flex gap-3 py-3">
      <span v-if="idx < steps.length - 1"
            class="absolute left-[15px] top-9 bottom-0 w-0.5"
            :class="connectorClass(step.status)" />
      <span class="w-8 h-8 rounded-full grid place-items-center flex-shrink-0 z-10 border-2 text-[12.5px] font-semibold"
            :class="markerClass(step.status)">
        <svg v-if="step.status === 'done'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else-if="step.status === 'rejected'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span v-else>{{ idx + 1 }}</span>
      </span>
      <div class="flex-1 min-w-0 pt-0.5">
        <div class="text-[14.5px] font-medium text-foreground">{{ step.name }}</div>
        <div v-if="step.role" class="text-[13px] text-muted-foreground mt-0.5">{{ step.role }}</div>
        <div v-if="step.meta" class="font-mono text-[12.5px] text-muted-foreground/70 mt-1">{{ step.meta }}</div>
        <div v-if="step.comment"
             class="mt-1.5 px-2.5 py-2 rounded bg-muted text-[13.5px] text-foreground leading-relaxed">
          {{ step.comment }}
        </div>
      </div>
    </li>
  </ol>
</template>
