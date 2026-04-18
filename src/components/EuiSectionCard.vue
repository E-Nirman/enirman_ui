<template>
  <EuiCard :title="title" :icon="icon" :badge="badge" :flush="flush">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </EuiCard>
</template>

<script setup>
import EuiCard from './EuiCard.vue'

/*
 * EuiSectionCard — convenience wrapper over EuiCard for dashboard sections.
 * Same props and slots as EuiCard; just a semantic alias that encourages
 * consistent usage for "Status Breakdown", "Recent Projects", etc.
 */
defineProps({
  title: { type: String, required: true },
  icon:  { type: [Object, Function], default: null },
  badge: { type: String, default: '' },
  flush: { type: Boolean, default: false },
})
</script>
