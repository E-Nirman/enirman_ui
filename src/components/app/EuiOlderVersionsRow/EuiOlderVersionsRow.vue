<script setup>
defineOptions({ name: 'EuiOlderVersionsRow' })

/*
 * EuiOlderVersionsRow (v3) — the expandable sub-row a list table reveals
 * when the version cell's "N older" link is clicked. A tinted band under
 * the drawing row; each line is mono version + dot+ink status + muted
 * cause/date. Replaces stacking old versions as full table rows.
 *
 * Props: versions: [{ version_label, status, meta }]
 * Drop it directly under the drawing row (full width). Visibility is the
 * caller's concern — render it only while expanded.
 */

defineProps({
  versions: { type: Array, required: true },
})

const STATUS_TONE = {
  'Client Approved':      'success',
  'Reviewer Approved':    'success',
  'Approved':             'success',
  'Municipally Approved': 'success',
  'Needs Correction':     'warning',
  'Client: Correction':   'warning',
  'Needs Redesign':       'destructive',
  'Client: Redesign':     'destructive',
  'Rejected':             'destructive',
  'Sent to Client':       'info',
  'Internal Review':      'info',
}

// full literal class strings (Tailwind JIT)
const TONE = {
  success:     { dot: 'bg-success',          ink: 'text-success-ink' },
  warning:     { dot: 'bg-warning',          ink: 'text-warning-ink' },
  destructive: { dot: 'bg-destructive',      ink: 'text-destructive-ink' },
  info:        { dot: 'bg-info',             ink: 'text-info-ink' },
  neutral:     { dot: 'bg-muted-foreground', ink: 'text-muted-foreground' },
}
const tone = (status) => TONE[STATUS_TONE[status] || 'neutral'] || TONE.neutral
</script>

<template>
  <div class="border-t border-border-subtle bg-muted/40 px-7 pb-2.5 pt-2">
    <div v-for="v in versions" :key="v.version_label" class="flex items-center gap-3.5 py-[5px]">
      <span class="w-[52px] flex-none font-mono text-xs font-semibold text-muted-foreground">{{ v.version_label }}</span>
      <span class="inline-flex items-center gap-1.5 text-2xs font-semibold" :class="tone(v.status).ink">
        <span class="h-1.5 w-1.5 rounded-full" :class="tone(v.status).dot" />{{ v.status }}
      </span>
      <span v-if="v.meta" class="text-2xs font-medium text-muted-foreground/70">{{ v.meta }}</span>
    </div>
  </div>
</template>
