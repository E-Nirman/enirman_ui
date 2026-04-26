<script setup>
defineOptions({ name: 'EuiVersionTimeline' })

defineProps({
  versions: { type: Array, required: true },
  emitOnSelect: { type: Boolean, default: true },
})
const emit = defineEmits(['select'])
</script>

<template>
  <ol class="space-y-2">
    <li
      v-for="v in versions"
      :key="v.name"
      class="flex gap-3 cursor-pointer hover:bg-muted/30 rounded-md p-2"
      @click="emitOnSelect && emit('select', v)"
    >
      <span
        class="size-6 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold"
        :class="
          v.is_current ? 'bg-success text-success-foreground'
          : v.status === 'Needs Redesign' || v.status === 'Needs Correction' ? 'border-2 border-destructive text-destructive'
          : 'border-2 border-border text-muted-foreground'
        "
      >
        <template v-if="v.is_current">✓</template>
        <template v-else-if="v.status?.startsWith('Needs')">!</template>
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span class="font-mono text-xs font-semibold">{{ v.version_label }}</span>
          <span class="text-[10px] text-muted-foreground">{{ v.status }}</span>
          <span v-if="v.branched_from" class="text-[10px] text-violet-400">
            ← branched from {{ v.branched_from_status || '?' }}
          </span>
        </div>
        <div class="text-[10px] text-muted-foreground">{{ v.modified }}</div>
      </div>
    </li>
  </ol>
</template>
