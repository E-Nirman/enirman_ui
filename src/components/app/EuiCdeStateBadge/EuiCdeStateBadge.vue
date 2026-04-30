<script setup>
import { computed } from 'vue'
import { Badge } from '../../ui/badge/index.js'

defineOptions({ name: 'EuiCdeStateBadge' })

/*
 * EuiCdeStateBadge — CDE (Common Data Environment) state.
 *
 * Routes through the design-system Badge so colors live in tokens.
 * State → variant mapping:
 *   WIP        → draft   (neutral; "in progress, not yet shared")
 *   Shared     → pending (warning; "needs review")
 *   Published  → success
 *   Archived   → default (muted)
 */

const props = defineProps({
  state: { type: String, required: true },
})

const config = {
  WIP:       { label: 'Work in Progress',  variant: 'draft' },
  Shared:    { label: 'Shared for Review', variant: 'pending' },
  Published: { label: 'Approved & Issued', variant: 'success' },
  Archived:  { label: 'Archived',          variant: 'default' },
}

const display = computed(() => config[props.state] || config.WIP)
</script>

<template>
  <Badge :variant="display.variant">{{ display.label }}</Badge>
</template>
