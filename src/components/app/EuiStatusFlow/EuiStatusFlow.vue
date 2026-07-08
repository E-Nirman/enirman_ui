<script setup>
import { computed } from 'vue'

defineOptions({ name: 'EuiStatusFlow' })

/*
 * EuiStatusFlow (v3) — a vertical "Stage" stepper (replaces the v2
 * horizontal chip-and-arrow row). Each step is a circle + connector on
 * the left and a label/caption on the right:
 *
 *   done      16px success-filled circle + ✓, success-muted connector,
 *             muted 12px label with inline meta (e.g. "12 Jan · ram")
 *   current   tone-filled circle + step number + 3px tone-muted halo,
 *             bold 13px label + caption; `elapsed` renders in danger ink
 *             (e.g. "with Anup since 18 Feb · 36 days")
 *   upcoming  2px outline circle, muted label
 *   next      dashed outline circle, muted label + " — up next"
 *
 * Props: steps: [{ label, state, meta, quote, elapsed, tone }]
 *   state: 'done' | 'current' | 'upcoming' | 'next'   (default 'upcoming')
 *   tone:  current-step accent — 'info'|'success'|'warning'|'destructive'
 *          (default 'info' — blue "in progress")
 */

const props = defineProps({
  steps: { type: Array, required: true },
})

// Full class strings only — no runtime concatenation (Tailwind JIT).
const CURRENT_TONE = {
  info:        'bg-info text-info-foreground ring-info-muted',
  success:     'bg-success text-success-foreground ring-success-muted',
  warning:     'bg-warning text-warning-foreground ring-warning-muted',
  destructive: 'bg-destructive text-destructive-foreground ring-destructive-muted',
}

const view = computed(() =>
  props.steps.map((s, idx) => ({
    ...s,
    state: s.state || 'upcoming',
    index: idx,
    number: idx + 1,
    last: idx === props.steps.length - 1,
    toneClass: CURRENT_TONE[s.tone] || CURRENT_TONE.info,
  })),
)
</script>

<template>
  <div class="flex flex-col">
    <div v-for="step in view" :key="step.label" class="flex gap-2.5">
      <!-- rail: circle + connector -->
      <div class="flex flex-col items-center">
        <span
          v-if="step.state === 'done'"
          class="flex-none grid place-items-center h-4 w-4 rounded-full text-[9px] font-bold leading-none bg-success text-success-foreground"
        >✓</span>
        <span
          v-else-if="step.state === 'current'"
          class="flex-none grid place-items-center h-4 w-4 rounded-full text-[9px] font-bold leading-none ring-[3px]"
          :class="step.toneClass"
        >{{ step.number }}</span>
        <span
          v-else
          class="flex-none h-4 w-4 rounded-full border-2 border-border-strong"
          :class="step.state === 'next' ? 'border-dashed' : ''"
        />
        <span
          v-if="!step.last"
          class="w-0.5 flex-1 min-h-[14px]"
          :class="step.state === 'done' ? 'bg-success-muted' : 'bg-border'"
        />
      </div>

      <!-- label + caption -->
      <div class="pb-3 min-w-0">
        <template v-if="step.state === 'current'">
          <div class="text-sm font-semibold text-foreground">{{ step.label }}</div>
          <div v-if="step.meta || step.elapsed" class="mt-0.5 text-2xs font-medium text-muted-foreground">
            <span v-if="step.meta">{{ step.meta }}</span><span v-if="step.meta && step.elapsed"> · </span><span
              v-if="step.elapsed" class="font-semibold text-destructive-ink">{{ step.elapsed }}</span>
          </div>
          <div v-if="step.quote" class="mt-0.5 text-2xs italic text-muted-foreground/80">“{{ step.quote }}”</div>
        </template>
        <template v-else>
          <div
            class="text-xs font-medium"
            :class="step.state === 'done' ? 'text-muted-foreground' : 'text-muted-foreground/70'"
          >
            {{ step.label
            }}<span v-if="step.meta" class="ml-1.5 text-2xs text-muted-foreground/70">{{ step.meta }}</span
            ><span v-if="step.state === 'next'" class="ml-1.5 text-2xs text-muted-foreground/70">— up next</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
