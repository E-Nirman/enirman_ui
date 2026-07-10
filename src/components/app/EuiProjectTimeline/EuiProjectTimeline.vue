<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiProjectTimeline' })

/*
 * EuiProjectTimeline (v3) — dashboard Gantt.
 *
 *   grid       labelWidth column + a time track with hairline gridlines
 *              drawn once at the real period boundaries
 *   per row    estimated bar (dashed, 9px) above the actual bar(s) (solid
 *              pill, 11px; design = primary, municipal = amber w/ navy ink)
 *   today      2px primary vertical line at 55% opacity across all rows
 *   legend     Estimated / Actual / Today
 *   controls   Week / Month / Quarter segmented control (presentational —
 *              the consumer recomputes `months` + positions on the event)
 *
 * All bar positions are percentages of the whole track (0–100).
 *
 * Project shape: {
 *   title, code, status,
 *   estimated?: { start, width },
 *   actual?: [{ label, start, width, tone }]
 * }
 * Bar `tone`: 'primary'|'info'|'plus'|'warning'|'success'|'neutral'|
 * 'municipal'. `phase: 'design'|'municipal'` still works as an alias.
 *
 * `months` accepts either plain labels (equal-width columns):
 *     ['Bai', 'Jet', 'Asa', 'Shr']
 * or periods of unequal length, which is what real calendars produce —
 * Gregorian months run 28–31 days, Bikram Sambat months 29–32:
 *     [{ label: 'Bai', days: 31 }, { label: 'Jet', days: 32 }, …]
 *     [{ label: 'Bai', widthPct: 24.6 }, …]
 * `days` / `widthPct` are normalised to sum to 100, so the gridlines land
 * on the true period boundaries and the bars line up with them.
 *
 * `minWidth` (px) makes the chart scroll horizontally rather than
 * compress — set it when the window is long enough that equal division
 * would squeeze bars into slivers. The label column stays pinned.
 */

const props = defineProps({
  projects:    { type: Array,  default: () => [] },
  months:      { type: Array,  default: () => [] },   // string[] | {label, days|widthPct}[]
  todayPct:    { type: Number, default: null },       // 0–100 across the track
  granularity: { type: String, default: 'month' },    // 'week'|'month'|'quarter'
  title:       { type: String, default: '' },
  subtitle:    { type: String, default: '' },
  labelWidth:  { type: Number, default: 200 },
  minWidth:    { type: Number, default: 0 },          // 0 = fit, no scroll
})
const emit = defineEmits(['granularity-change'])

const GRAINS = ['Week', 'Month', 'Quarter']

/*
 * Actual-bar colour. Prefer `tone` on the bar; `phase` is the original
 * two-value alias kept for compatibility.
 *
 * `municipal` is a deliberate safety accent: saturated amber with navy
 * ink, verified legible on both canvases. Everything else is a tone
 * family, so it re-tints in dark mode.
 * (Full literal classes — Tailwind JIT can't see runtime concatenation.)
 *
 * Caution: theme.css gives `--primary` and `--info` the same blue, and
 * `--plus` and `--warning` the same amber. Only three saturated hues are
 * actually distinguishable — don't rely on those pairs to separate two
 * things the reader must tell apart.
 */
const TONE_CLASS = {
  primary:   'bg-primary text-primary-foreground',
  info:      'bg-info text-info-foreground',
  plus:      'bg-plus text-plus-foreground',
  warning:   'bg-warning text-warning-foreground',
  success:   'bg-success text-success-foreground',
  // solid, not a tint: a `bg-muted` bar with muted ink is illegible.
  neutral:   'bg-muted-foreground text-background',
  municipal: 'bg-amber-400 text-navy-800', // theme-token-ok
}
const PHASE_ALIAS = { design: 'primary', municipal: 'municipal' }
const barClass = (b) =>
  TONE_CLASS[b.tone] || TONE_CLASS[PHASE_ALIAS[b.phase]] || TONE_CLASS.primary

// status → dot + ink for the label cell
const STATUS_TONE = {
  Structural: 'info', Design: 'info', Municipal: 'warning',
  Approved: 'success', 'Municipally Approved': 'success',
}
const TONE = {
  info:    { dot: 'bg-info',             ink: 'text-info-ink' },
  warning: { dot: 'bg-warning',          ink: 'text-warning-ink' },
  success: { dot: 'bg-success',          ink: 'text-success-ink' },
  neutral: { dot: 'bg-muted-foreground', ink: 'text-muted-foreground' },
}
const tone = (status) => TONE[STATUS_TONE[status] || 'neutral'] || TONE.neutral

/*
 * Semantic tokens only. The raw gray and brand scales are absolute
 * swatches — they do NOT flip in dark mode — so using them for surfaces
 * paints light bars onto a dark canvas.
 */
const ESTIMATED_BAR = {
  border: '1.5px dashed hsl(var(--border-strong))',
  background: 'hsl(var(--muted))',
}

// Normalise months to [{ label, widthPct, leftPct }] summing to 100.
// Plain strings divide the track evenly; `days` / `widthPct` are scaled.
const periods = computed(() => {
  const raw = props.months || []
  if (!raw.length) return []
  const objs = raw.map((m) => (typeof m === 'string' ? { label: m } : { ...m }))
  const sizes = objs.map((o) => Number(o.widthPct ?? o.days) || 0)
  const total = sizes.reduce((a, b) => a + b, 0)
  const even = total <= 0
  let acc = 0
  return objs.map((o, i) => {
    const widthPct = even ? 100 / objs.length : (sizes[i] / total) * 100
    const leftPct = acc
    acc += widthPct
    return { label: o.label, widthPct, leftPct }
  })
})

const cols = computed(() => `${props.labelWidth}px 1fr`)

// An x-position given as a % of the *track*, expressed across the whole
// grid (label column + track) — used by overlays that span both.
const acrossGrid = (pct) =>
  `calc(${props.labelWidth}px + (100% - ${props.labelWidth}px) * ${pct / 100})`

const todayStyle = computed(() => ({
  left: acrossGrid(props.todayPct || 0),
  background: 'hsl(var(--primary))',
  opacity: 0.55,
}))
const gridlineStyle = (p) => ({ left: acrossGrid(p.leftPct), background: 'hsl(var(--border))' })

const estStyle = (b) => ({
  left: `${b.start}%`, width: `${b.width}%`, top: '9px', height: '9px',
  ...ESTIMATED_BAR,
})
const actStyle = (b) => ({ left: `${b.start}%`, width: `${b.width}%`, top: '21px', height: '11px' })
</script>

<template>
  <div class="rounded-xl border border-border-subtle bg-card">
    <!-- header -->
    <div class="flex items-center justify-between border-b border-border-subtle px-4 py-3">
      <div class="min-w-0">
        <div v-if="title" class="text-sm font-semibold text-foreground">{{ title }}</div>
        <div v-if="subtitle" class="font-mono text-[11px] text-muted-foreground/70">{{ subtitle }}</div>
      </div>
      <div class="inline-flex flex-none rounded-md border border-border-subtle bg-muted/40 p-0.5">
        <button
          v-for="g in GRAINS"
          :key="g"
          type="button"
          class="rounded px-2.5 py-1 text-2xs font-semibold transition-colors"
          :class="granularity === g.toLowerCase()
            ? 'bg-card text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'"
          @click="emit('granularity-change', g.toLowerCase())"
        >{{ g }}</button>
      </div>
    </div>

    <div class="px-4 pb-2.5 pt-3">
      <div class="overflow-x-auto">
        <div :style="minWidth ? { minWidth: minWidth + 'px' } : undefined">
          <!-- period header: labels sit at their true offsets -->
          <div class="mb-0.5 grid" :style="{ gridTemplateColumns: cols }">
            <!-- pinned, so scrolled period labels don't slide into the label column -->
            <div class="sticky left-0 z-[3] bg-card" />
            <div class="relative h-[18px]">
              <div
                v-for="p in periods"
                :key="p.label + p.leftPct"
                class="absolute top-0 border-l border-border pl-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70"
                :style="{ left: p.leftPct + '%', width: p.widthPct + '%' }"
              >{{ p.label }}</div>
            </div>
          </div>

          <!-- rows, with gridlines + today drawn once across all of them -->
          <div class="relative">
            <div
              v-for="p in periods"
              :key="'gl-' + p.leftPct"
              class="pointer-events-none absolute top-0 bottom-0 w-px"
              :style="gridlineStyle(p)"
            />
            <div v-if="todayPct != null" class="pointer-events-none absolute top-0 bottom-0 z-[2] w-0.5" :style="todayStyle" />

            <div
              v-for="p in projects"
              :key="p.code || p.title"
              class="grid items-center border-t border-border-subtle"
              :style="{ gridTemplateColumns: cols }"
            >
              <!-- label (pinned while the track scrolls) -->
              <div class="sticky left-0 z-[3] min-w-0 bg-card py-2.5 pr-3">
                <div class="truncate text-xs font-semibold text-foreground">{{ p.title }}</div>
                <div class="mt-0.5 flex items-center gap-1.5">
                  <span v-if="p.code" class="font-mono text-[10px] font-medium text-muted-foreground/70">{{ p.code }}</span>
                  <span v-if="p.status" class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="tone(p.status).ink">
                    <span class="h-[5px] w-[5px] rounded-full" :class="tone(p.status).dot" />{{ p.status }}
                  </span>
                </div>
              </div>

              <!-- track -->
              <div class="relative h-10">
                <div v-if="p.estimated" class="absolute rounded-full" :style="estStyle(p.estimated)" />
                <div
                  v-for="(b, i) in (p.actual || [])"
                  :key="i"
                  class="absolute z-[1] flex items-center overflow-hidden rounded-full px-[7px]"
                  :class="barClass(b)"
                  :style="actStyle(b)"
                >
                  <span v-if="b.label" class="truncate text-[9px] font-semibold tracking-wide">{{ b.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- legend -->
      <div class="mt-0.5 flex items-center gap-4 border-t border-border-subtle pt-2.5 text-[11px] font-medium text-muted-foreground">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-[7px] w-[18px] rounded-full border-[1.5px] border-dashed border-border-strong bg-muted" />Estimated
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-[7px] w-[18px] rounded-full bg-primary" />Actual
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-3 w-0.5 bg-primary opacity-[0.55]" />Today
        </span>
      </div>
    </div>
  </div>
</template>
