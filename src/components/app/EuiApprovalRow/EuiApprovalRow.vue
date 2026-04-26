<script setup>
import EuiPriorityMark from '../EuiPriorityMark/EuiPriorityMark.vue'

defineOptions({ name: 'EuiApprovalRow' })

defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="w-full grid items-center gap-3 px-4 sm:px-[18px] py-3 border-b border-border/50 last:border-b-0 transition-colors text-left"
    style="grid-template-columns: 4px 1fr auto auto;"
    :class="item.urgent ? 'bg-destructive/5 hover:bg-destructive/10' : 'hover:bg-muted/40'"
    @click="emit('click', item)"
  >
    <EuiPriorityMark :priority="item.priority || 'none'" />

    <div class="min-w-0">
      <div class="font-mono text-[11px] text-muted-foreground/80 mb-0.5 truncate">{{ item.id }}</div>
      <div class="text-[13px] font-medium text-foreground mb-0.5 truncate">{{ item.title }}</div>
      <div class="text-[11.5px] text-muted-foreground truncate">{{ item.meta }}</div>
    </div>

    <span
      v-if="item.status"
      class="text-[11.5px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap"
      :class="{
        'text-warning bg-warning/10 border-warning/30': item.status === 'In review' || item.status === 'Awaiting response',
        'text-success bg-success/10 border-success/30': item.status === 'Approved',
        'text-destructive bg-destructive/10 border-destructive/30': item.status === 'Revise',
        'text-muted-foreground bg-muted border-border': !['In review','Awaiting response','Approved','Revise'].includes(item.status),
      }"
    >
      {{ item.status }}
    </span>

    <div class="text-right font-mono whitespace-nowrap">
      <div
        class="text-[12px] font-semibold"
        :class="(item.days || '').toString().startsWith('-') || (item.days || '').toString().startsWith('−') ? 'text-destructive' : 'text-foreground'"
      >
        {{ item.days }}
      </div>
      <div class="text-[10.5px] text-muted-foreground/80 uppercase tracking-wider">{{ item.daysLabel }}</div>
    </div>
  </button>
</template>
