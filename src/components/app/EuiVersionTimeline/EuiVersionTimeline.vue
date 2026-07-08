<script setup>
import { computed, ref } from 'vue'

defineOptions({ name: 'EuiVersionTimeline' })

/*
 * EuiVersionTimeline (v3) — one card per version, newest first.
 *
 *   current  border-info + bg-info-muted container with a "current" chip
 *   entry    mono version (bold) + ONE status (dot + ink text, right) +
 *            one-line human description + meta row (PDF · author · time)
 *   revisions a version carrying `revisions: [...]` collapses to
 *            "v1 · N revisions" and expands to dot+ink revision rows
 *
 * Version shape: {
 *   name, version_label, status, is_current,
 *   description, pdf_url, author, modified,
 *   revisions?: [{ version_label, status, meta }]
 * }
 */

const props = defineProps({
  versions: { type: Array, required: true },
  emitOnSelect: { type: Boolean, default: true },
})
const emit = defineEmits(['select'])

// status → tone family. Extend at the call site by pre-mapping if needed.
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

// dot + ink pairs (full literal class strings for Tailwind JIT).
const TONE = {
  success:     { dot: 'bg-success',          ink: 'text-success-ink' },
  warning:     { dot: 'bg-warning',          ink: 'text-warning-ink' },
  destructive: { dot: 'bg-destructive',      ink: 'text-destructive-ink' },
  info:        { dot: 'bg-info',             ink: 'text-info-ink' },
  neutral:     { dot: 'bg-muted-foreground', ink: 'text-muted-foreground' },
}
const tone = (status) => TONE[STATUS_TONE[status] || 'neutral'] || TONE.neutral

const expanded = ref(new Set())
const keyOf = (v) => v.name || v.version_label
const toggle = (v) => {
  const s = new Set(expanded.value)
  const k = keyOf(v)
  s.has(k) ? s.delete(k) : s.add(k)
  expanded.value = s
}
const isOpen = (v) => expanded.value.has(keyOf(v))

const select = (v) => { if (props.emitOnSelect) emit('select', v) }
</script>

<template>
  <div class="space-y-2.5">
    <template v-for="v in versions" :key="keyOf(v)">
      <!-- collapsed / expandable revision group -->
      <div v-if="v.revisions && v.revisions.length" class="rounded-lg border border-border-subtle p-3">
        <button
          type="button"
          class="flex w-full items-center gap-2 text-left"
          @click="toggle(v)"
        >
          <span class="font-mono text-sm font-semibold text-foreground/90">{{ v.version_label }}</span>
          <span class="text-[10px] font-medium text-muted-foreground/70">{{ v.revisions.length }} revisions</span>
          <span class="ml-auto inline-flex items-center gap-1.5 text-2xs font-semibold" :class="tone(v.status).ink">
            <span class="h-1.5 w-1.5 rounded-full" :class="tone(v.status).dot" />{{ v.status }}
          </span>
          <svg class="size-3 text-muted-foreground/60 transition-transform" :class="isOpen(v) ? 'rotate-90' : ''"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <div v-if="isOpen(v)" class="mt-2 space-y-0.5">
          <div v-for="r in v.revisions" :key="r.version_label"
               class="flex items-center gap-3.5 py-1">
            <span class="w-11 flex-none font-mono text-xs font-semibold text-muted-foreground">{{ r.version_label }}</span>
            <span class="inline-flex items-center gap-1.5 text-2xs font-semibold" :class="tone(r.status).ink">
              <span class="h-1.5 w-1.5 rounded-full" :class="tone(r.status).dot" />{{ r.status }}
            </span>
            <span v-if="r.meta" class="text-2xs font-medium text-muted-foreground/70">{{ r.meta }}</span>
          </div>
        </div>
      </div>

      <!-- version card -->
      <div
        v-else
        class="rounded-lg border p-3"
        :class="[
          v.is_current ? 'border-info bg-info-muted' : 'border-border-subtle',
          emitOnSelect ? 'cursor-pointer hover:border-border-strong' : '',
        ]"
        @click="select(v)"
      >
        <div class="flex items-center gap-2">
          <span class="font-mono text-sm text-foreground"
                :class="v.is_current ? 'font-bold' : 'font-semibold'">{{ v.version_label }}</span>
          <span v-if="v.is_current"
                class="rounded-[4px] bg-info/20 px-1.5 py-0.5 text-[10px] font-semibold text-info-ink">current</span>
          <span class="ml-auto inline-flex items-center gap-1.5 text-2xs font-semibold" :class="tone(v.status).ink">
            <span class="h-1.5 w-1.5 rounded-full" :class="tone(v.status).dot" />{{ v.status }}
          </span>
        </div>
        <div v-if="v.description" class="mt-1.5 text-xs font-medium text-foreground/90">{{ v.description }}</div>
        <div class="mt-2 flex items-center gap-2 text-2xs font-medium text-muted-foreground">
          <a v-if="v.pdf_url" :href="v.pdf_url" target="_blank" rel="noopener"
             class="text-info-ink hover:underline" @click.stop>PDF</a>
          <template v-if="v.author"><span v-if="v.pdf_url">·</span><span>{{ v.author }}</span></template>
          <template v-if="v.modified"><span v-if="v.pdf_url || v.author">·</span><span>{{ v.modified }}</span></template>
        </div>
      </div>
    </template>
  </div>
</template>
