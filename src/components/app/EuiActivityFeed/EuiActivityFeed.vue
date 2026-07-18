<script setup>
import { computed } from 'vue'
import EuiReviewCard from '../EuiReviewCard/EuiReviewCard.vue'

defineOptions({ name: 'EuiActivityFeed' })

const props = defineProps({
  entries: { type: Array, required: true },  // mixed: {kind: 'review'|'comment'|'rfi'|'event'|'activity', ...}
  order:   { type: String, default: 'asc' }, // 'asc' (thread) | 'desc' (recent-activity card)
})

const sorted = computed(() => {
  const s = [...props.entries].sort((a, b) =>
    (a.timestamp || a.creation || '').localeCompare(b.timestamp || b.creation || ''))
  return props.order === 'desc' ? s.reverse() : s
})

// 'activity' rows: dashboard "Recent activity" anatomy — avatar + rich
// text + timestamp. Initials derive from `actor` when not given; a
// single-word name still yields two letters (ram → RM-style).
const initials = (e) => {
  if (e.initials) return e.initials
  const words = (e.actor || '?').trim().split(/\s+/)
  const raw = words.length > 1 ? words.map(w => w[0]).join('') : words[0].slice(0, 2)
  return raw.slice(0, 2).toUpperCase()
}

/* Identity swatches (mockup: saturated avatar colors, white ink).
 * Deterministic per actor so a person keeps their color. These are
 * deliberate brand accents, legible on both canvases. theme-token-ok */
const AVATAR_TONES = [
  'bg-primary text-primary-foreground',
  'bg-plus text-plus-foreground',
  'bg-success text-success-foreground',
  'bg-navy-500 text-white', // theme-token-ok — identity swatch, legible on both canvases
]
const avatarTone = (e) => {
  const k = e.actor || e.initials || '?'
  let h = 0
  for (const c of k) h = ((h * 31) + c.charCodeAt(0)) >>> 0
  return AVATAR_TONES[h % AVATAR_TONES.length]
}
</script>

<template>
  <div class="space-y-3">
    <template v-for="entry in sorted" :key="entry.kind + ':' + (entry.name || entry.id)">
      <EuiReviewCard v-if="entry.kind === 'review'" :review="entry" />
      <div v-else-if="entry.kind === 'comment'" class="rounded-md bg-muted/30 p-3">
        <div class="text-xs text-muted-foreground mb-1">{{ entry.owner }} · {{ entry.creation }}</div>
        <div class="text-sm whitespace-pre-wrap" v-html="entry.content" />
      </div>
      <div v-else-if="entry.kind === 'rfi'" class="rounded-md border border-warning-muted bg-warning-muted/40 p-3">
        <div class="flex flex-wrap items-center gap-1.5 mb-1">
          <span class="text-[10px] font-bold uppercase text-warning-ink tracking-wider">RFI</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full border border-warning-muted text-warning-ink">{{ entry.priority || 'Normal' }}</span>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">{{ entry.status }}</span>
        </div>
        <div class="text-sm font-medium">{{ entry.question_summary }}</div>
        <div class="text-xs text-muted-foreground mt-1">
          {{ entry.raised_by }}<span v-if="entry.timestamp"> · {{ entry.timestamp }}</span>
        </div>
      </div>
      <div v-else-if="entry.kind === 'event'" class="text-xs text-muted-foreground flex items-center gap-2 pl-3">
        <span class="size-1.5 rounded-full bg-muted-foreground/50" />
        <span>{{ entry.text }}<span v-if="entry.timestamp"> · {{ entry.timestamp }}</span></span>
      </div>
      <div v-else-if="entry.kind === 'activity'" class="flex gap-2.5 border-b border-border-subtle pb-3 last:border-b-0 last:pb-0">
        <span :class="['grid h-6 w-6 flex-none place-items-center rounded-full text-[9px] font-bold', avatarTone(entry)]">{{ initials(entry) }}</span>
        <div class="min-w-0 flex-1">
          <div class="text-[13px] leading-snug text-foreground/90">
            <slot name="activity-text" :entry="entry"><span v-html="entry.html || entry.text" /></slot>
          </div>
          <div v-if="entry.timestamp" class="mt-0.5 text-2xs font-medium text-muted-foreground/80">{{ entry.timestamp }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
