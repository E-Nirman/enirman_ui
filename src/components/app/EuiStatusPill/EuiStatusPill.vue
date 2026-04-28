<script setup>
import { computed } from 'vue'
import { cn } from '../../../lib/utils.js'

defineOptions({ name: 'EuiStatusPill' })

/**
 * EuiStatusPill — Plumb-style status indicator.
 * Pill with a colored dot prefix + soft bg + colored border.
 *
 * Props:
 *   tone: one of approved | review | revise | draft | issued | superseded | info | coord
 *         (or 'auto' to derive from `status` text)
 *   status: free-text status; used as label and (when tone='auto') for derivation
 */
const props = defineProps({
  tone: { type: String, default: 'auto' },
  status: { type: String, required: true },
})

// Derive tone from common status strings if tone='auto'.
const STATUS_TONE_MAP = {
  // approved-like
  'approved': 'approved',
  'municipality approved': 'approved',
  'client approved': 'approved',
  // review-like (in progress)
  'in review': 'review',
  'internal review': 'review',
  'sent to client': 'review',
  'municipality process': 'review',
  'awaiting response': 'review',
  // revise / rejected
  'revise': 'revise',
  'revise & resubmit': 'revise',
  'rejected': 'revise',
  'needs redesign': 'revise',
  'needs correction': 'revise',
  'municipality change requested': 'revise',
  // draft-like (pending start)
  'draft': 'draft',
  'working': 'draft',
  'pending': 'draft',
  // issued
  'issued': 'issued',
  'issued for construction': 'issued',
  'for construction': 'issued',
  'published': 'issued',
  // superseded / archived
  'superseded': 'superseded',
  'archived': 'superseded',
  'closed': 'superseded',
  // info
  'responded': 'info',
  'open': 'info',
  // coord
  'coordination': 'coord',
}

const resolvedTone = computed(() => {
  if (props.tone && props.tone !== 'auto') return props.tone
  const key = (props.status || '').toLowerCase().trim()
  return STATUS_TONE_MAP[key] || 'draft'
})

const TONE_CLASSES = {
  approved:   'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
  review:     'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
  revise:     'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',
  draft:      'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/30',
  issued:     'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
  superseded: 'text-muted-foreground bg-muted border-border',
  info:       'text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30',
  coord:      'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30',
}
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[12.5px] font-medium leading-tight',
      TONE_CLASSES[resolvedTone] || TONE_CLASSES.draft,
    )"
  >
    <span class="size-1.5 rounded-full bg-current"></span>
    {{ status }}
  </span>
</template>
