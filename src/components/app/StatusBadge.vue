<script setup>
import { computed } from 'vue'
import { Badge } from '../ui/badge/index.js'

/*
 * StatusBadge — resolves domain status strings to visual tones so
 * consumers don't need to maintain per-status colour lookups in every
 * page. Extendable: pass `toneMap` to add or override mappings.
 *
 * Default mappings handle the eNirman project / design / payment /
 * client-approval / municipal lifecycle statuses.
 *
 * v3 convention: one colored status element per row/entity. StatusBadge
 * is that single element — a tinted pill with a leading dot. Revision
 * types (Initial / Complete Redesign / …) are NOT statuses; they render
 * as muted context text at the call site, so they were removed from the
 * tone map. The overdue counter ("36 days in review") is likewise not
 * part of the badge — render it as a separate `text-danger` caption.
 */

const DEFAULT_MAP = {
  // Project / DPR
  'Draft':                          'default',
  'Planning':                       'default',   // mockup: gray — colored stages start at design
  'Design':                         'primary',
  'Structural Design':              'info',
  'Municipal':                      'warning',
  'Municipally Approved':           'success',
  'Cancelled':                      'default',

  // Design
  'Internal Review':                'info',
  'Sent to Client':                 'info',
  'Needs Redesign':                 'destructive',
  'Needs Correction':               'warning',
  'Reviewer Approved':              'success',
  'Client Approved':                'success',
  'Client: Redesign':               'destructive',
  'Client: Correction':             'warning',
  'Municipality Change Requested':  'warning',
  'Municipality Process':           'info',

  // Payment modes
  'Cash':                           'success',
  'Bank Transfer':                  'info',
  'eSewa':                          'plus',
  'Khalti':                         'plus',

  // WhatsApp / subscription (v4 mockup screens)
  'Live':                           'success',
  'Not Subscribed':                 'warning',
}

const props = defineProps({
  status:  { type: String, required: true },
  toneMap: { type: Object, default: () => ({}) },
  solid:   { type: Boolean, default: false },
  dot:     { type: Boolean, default: true },
  class:   { type: [String, Array, Object], default: '' },
})

const variant = computed(() => {
  const merged = { ...DEFAULT_MAP, ...props.toneMap }
  return merged[props.status] || 'default'
})
</script>

<template>
  <Badge :variant="variant" :solid="solid" :with-dot="dot" :class="props.class">
    {{ status }}
  </Badge>
</template>
