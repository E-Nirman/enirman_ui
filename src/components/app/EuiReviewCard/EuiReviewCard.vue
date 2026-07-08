<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiReviewCard' })

/*
 * EuiReviewCard (v3) — a single client / reviewer DECISION rendered as a
 * left-border accent card: a 3px solid tone rail, a tinted background and
 * right-only rounded corners. The three v2 outline badges (review type /
 * round / decision) are gone — the decision IS the card's tone.
 *
 *   Header: decision word in tone ink + mono version transition + date (right)
 *   Body:   the feedback quote, regular 12px
 *
 * Internal notes are deliberately NOT rendered here. Per the v3 convention
 * they live as a separate flat list (avatar + name + note type + quote) so
 * client feedback and internal chatter stay visually distinct — a consumer
 * renders those alongside, not inside, these cards.
 */

const props = defineProps({
  review: { type: Object, required: true },
})

// Raw decision → human label + tone. Covers reviewer + client variants.
const DECISION_MAP = {
  'Approved':           { label: 'Approved',             tone: 'success' },
  'Reviewer Approved':  { label: 'Approved',             tone: 'success' },
  'Client Approved':    { label: 'Approved',             tone: 'success' },
  'Needs Correction':   { label: 'Correction requested', tone: 'warning' },
  'Client: Correction': { label: 'Correction requested', tone: 'warning' },
  'Needs Redesign':     { label: 'Redesign requested',   tone: 'destructive' },
  'Client: Redesign':   { label: 'Redesign requested',   tone: 'destructive' },
  'Rejected':           { label: 'Rejected',             tone: 'destructive' },
  'Pending':            { label: 'Pending',              tone: 'neutral' },
}

// Full class strings (no dynamic concatenation — keeps Tailwind JIT happy).
const TONE_CLASS = {
  success:     { card: 'border-l-success bg-success-muted',         ink: 'text-success-ink' },
  warning:     { card: 'border-l-warning bg-warning-muted',         ink: 'text-warning-ink' },
  destructive: { card: 'border-l-destructive bg-destructive-muted', ink: 'text-destructive-ink' },
  neutral:     { card: 'border-l-border bg-muted',                  ink: 'text-foreground' },
}

const meta = computed(() =>
  DECISION_MAP[props.review.decision] || { label: props.review.decision || 'Review', tone: 'neutral' })

const tone = computed(() => TONE_CLASS[meta.value.tone] || TONE_CLASS.neutral)

// "v1.1.1 → v2" when both ends known; a single version otherwise.
const versionTransition = computed(() => {
  const r = props.review
  if (r.version_from && r.version_to) return `${r.version_from} → ${r.version_to}`
  return r.version_to || r.version || r.version_from || ''
})

const dateLabel = computed(() =>
  props.review.decision_date || props.review.timestamp || props.review.creation || '')

// Wrap the quote in typographic quotes unless the source already has them.
const quote = computed(() => {
  const f = (props.review.feedback || '').trim()
  if (!f) return ''
  return /^["“].*["”]$/.test(f) ? f : `“${f}”`
})
</script>

<template>
  <div class="rounded-r-lg border-l-[3px] px-3 py-2.5" :class="tone.card">
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold" :class="tone.ink">{{ meta.label }}</span>
      <span v-if="versionTransition"
            class="font-mono text-2xs font-semibold text-muted-foreground">{{ versionTransition }}</span>
      <span v-if="dateLabel"
            class="ml-auto text-2xs font-medium text-muted-foreground/80">{{ dateLabel }}</span>
    </div>
    <p v-if="quote" class="mt-1 text-xs text-foreground/90">{{ quote }}</p>
    <a v-if="review.markup_file" :href="review.markup_file" target="_blank" rel="noopener"
       class="mt-1.5 inline-block text-2xs font-medium text-info-ink hover:underline">📎 Markup</a>
  </div>
</template>
