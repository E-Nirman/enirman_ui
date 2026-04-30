<script setup>
/*
 * DetailRow — single label / value row for inspection panels.
 *
 * Used in dialog body, project details panels, side drawers — any
 * place where a fixed-width label sits left of its value. The value
 * slot accepts richer content (badges, links, dropdowns) so the
 * default text rendering can be replaced when needed.
 *
 * Props:
 *   label  — left column text (required)
 *   value  — fallback text when no #value slot is supplied
 */

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '' },
})
</script>

<template>
  <div class="flex items-center gap-4 px-5 py-3">
    <dt class="w-36 flex-shrink-0 text-sm text-muted-foreground">{{ label }}</dt>
    <dd class="flex-1 text-base text-foreground">
      <slot name="value">{{ value || '—' }}</slot>
    </dd>
  </div>
</template>
