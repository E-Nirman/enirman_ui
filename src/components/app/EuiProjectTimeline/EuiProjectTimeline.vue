<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiProjectTimeline' })

/*
 * EuiProjectTimeline (v3) — dashboard Gantt.
 *
 *   grid       200px label column + month track, hairline gridlines via a
 *              linear-gradient background (one line per month)
 *   per row    estimated bar (dashed, 9px) above the actual bar(s) (solid
 *              pill, 11px; design = primary, municipal = amber w/ navy ink)
 *   today      2px primary vertical line at 55% opacity across all rows
 *   legend     Estimated / Actual / Today
 *   controls   Week / Month / Quarter segmented control
 *
 * Positions are percentages across the month track (0–100).
 * Project shape: {
 *   title, code, status,
 *   estimated?: { start, width },
 *   actual?: [{ label, phase, start, width }]   // phase: 'design'|'municipal'
 * }
 */

const props = defineProps({
  projects:    { type: Array,  default: () => [] },
  months:      { type: Array,  default: () => [] },   // ['Bai','Jet','Asa','Shr']
  todayPct:    { type: Number, default: null },       // 0–100 across the track
  granularity: { type: String, default: 'month' },    // 'week'|'month'|'quarter'
  title:       { type: String, default: '' },
  subtitle:    { type: String, default: '' },
  labelWidth:  { type: Number, default: 200 },
})
const emit = defineEmits(['granularity-change'])

const GRAINS = ['Week', 'Month', 'Quarter']

// phase → actual-bar colour (full literal classes for Tailwind JIT)
const PHASE_CLASS = {
  design:    'bg-primary text-primary-foreground',
  municipal: 'bg-amber-400 text-navy-800',
}
const phaseClass = (phase) => PHASE_CLASS[phase] || PHASE_CLASS.design

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

const cols = computed(() => `${props.labelWidth}px 1fr`)
const trackStyle = computed(() => ({
  backgroundImage: 'linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
  backgroundSize: `${props.months.length ? 100 / props.months.length : 25}% 100%`,
}))
const todayStyle = computed(() => ({
  left: `calc(${props.labelWidth}px + (100% - ${props.labelWidth}px) * ${(props.todayPct || 0) / 100})`,
  background: 'hsl(var(--primary))',
  opacity: 0.55,
}))
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
      <!-- month header -->
      <div class="mb-0.5 grid" :style="{ gridTemplateColumns: cols }">
        <div />
        <div class="grid" :style="{ gridTemplateColumns: `repeat(${months.length || 4}, 1fr)` }">
          <div
            v-for="m in months"
            :key="m"
            class="border-l border-border pb-1.5 pl-2 pt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70"
          >{{ m }}</div>
        </div>
      </div>

      <!-- rows + today overlay -->
      <div class="relative">
        <div v-if="todayPct != null" class="absolute top-0 bottom-0 z-[2] w-0.5" :style="todayStyle" />

        <div
          v-for="p in projects"
          :key="p.code || p.title"
          class="grid items-center border-t border-border-subtle"
          :style="{ gridTemplateColumns: cols }"
        >
          <!-- label -->
          <div class="min-w-0 py-2.5 pr-3">
            <div class="truncate text-xs font-semibold text-foreground">{{ p.title }}</div>
            <div class="mt-0.5 flex items-center gap-1.5">
              <span v-if="p.code" class="font-mono text-[10px] font-medium text-muted-foreground/70">{{ p.code }}</span>
              <span v-if="p.status" class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="tone(p.status).ink">
                <span class="h-[5px] w-[5px] rounded-full" :class="tone(p.status).dot" />{{ p.status }}
              </span>
            </div>
          </div>

          <!-- track -->
          <div class="relative h-10" :style="trackStyle">
            <div
              v-if="p.estimated"
              class="absolute rounded-full"
              :style="estStyle(p.estimated)"
            />
            <div
              v-for="(b, i) in (p.actual || [])"
              :key="i"
              class="absolute flex items-center rounded-full px-[7px]"
              :class="phaseClass(b.phase)"
              :style="actStyle(b)"
            >
              <span v-if="b.label" class="text-[9px] font-semibold tracking-wide">{{ b.label }}</span>
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
