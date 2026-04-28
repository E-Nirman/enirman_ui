<script setup>
defineOptions({ name: 'EuiFilterChip' })
defineProps({
  active: { type: Boolean, default: false },
  count: { type: [Number, String], default: null },
})
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 h-7 px-2.5 border rounded-md text-[13.5px] transition-colors"
    :class="active
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'"
  >
    <slot name="icon" />
    <slot />
    <span v-if="count !== null"
          class="font-mono text-[10.5px] px-1.5 rounded-full"
          :class="active ? 'bg-card text-primary' : 'bg-muted text-muted-foreground'">
      {{ count }}
    </span>
  </button>
</template>
