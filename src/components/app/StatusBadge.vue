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
 */

const DEFAULT_MAP = {
  // Project / DPR
  'Draft':                          'default',
  'Planning':                       'info',
  'Design':                         'primary',
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

  // Revision types
  'Initial':                        'default',
  'Complete Redesign':              'destructive',
  'Major Revision':                 'warning',
  'Minor Correction':               'success',
}

const props = defineProps({
  status:  { type: String, required: true },
  toneMap: { type: Object, default: () => ({}) },
  solid:   { type: Boolean, default: false },
  class:   { type: [String, Array, Object], default: '' },
})

const variant = computed(() => {
  const merged = { ...DEFAULT_MAP, ...props.toneMap }
  return merged[props.status] || 'default'
})
</script>

<template>
  <Badge :variant="variant" :solid="solid" :class="props.class">
    {{ status }}
  </Badge>
</template>
