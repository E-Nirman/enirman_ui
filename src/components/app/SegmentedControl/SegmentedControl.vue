<script setup>
import { computed, ref, nextTick } from 'vue'
import { cn } from '../../../lib/utils.js'

/*
 * SegmentedControl (5.4.0) — a short, mutually exclusive choice shown as
 * joined segments (e.g. Length unit: m / ft; Calendar: BS / AD).
 *
 * Accessibility — the WAI-ARIA radio-group pattern:
 *   - container is role="radiogroup", labelled by `label` (aria-label) or
 *     `labelledby` (aria-labelledby);
 *   - each segment is role="radio" with aria-checked;
 *   - one tab stop: the checked segment (or the first enabled one when
 *     nothing is checked) has tabindex 0, the rest -1;
 *   - Arrow Right / Down → next, Arrow Left / Up → previous (wrapping,
 *     skipping disabled), Home / End → first / last. Moving selects, as
 *     native radios do. Space and Enter select the focused segment;
 *   - visible focus ring from --ring; every segment is at least
 *     --touch-target tall (44px desktop, 48px under data-platform="mobile").
 *
 * Styling uses tier-2 tokens only: track bg-muted, checked segment
 * bg-primary / text-primary-foreground (the brand's action colour),
 * unchecked text-fg3 → text-fg1 on hover.
 *
 * Props:
 *   options   [{ value, label, disabled? }] — value is a String or Number
 *   label     accessible name (use this or `labelledby`)
 *   labelledby id of a visible label element
 *   disabled  disables the whole group
 *   block     stretch to the container width, segments share it equally
 * v-model     the checked value
 * Slot `option` ({ option, checked }) replaces a segment's label content.
 */

const props = defineProps({
  options:    { type: Array, required: true },
  label:      { type: String, default: null },
  labelledby: { type: String, default: null },
  disabled:   { type: Boolean, default: false },
  block:      { type: Boolean, default: false },
})

const model = defineModel({ type: [String, Number], default: null })
const emit = defineEmits(['change'])

const buttons = ref([])

const isDisabled = (opt) => props.disabled || !!opt.disabled

const tabStop = computed(() => {
  const checked = props.options.findIndex((o) => o.value === model.value && !isDisabled(o))
  if (checked !== -1) return checked
  return props.options.findIndex((o) => !isDisabled(o))
})

function select(index) {
  const opt = props.options[index]
  if (!opt || isDisabled(opt)) return
  if (model.value !== opt.value) {
    model.value = opt.value
    emit('change', opt.value)
  }
}

function step(from, dir) {
  const n = props.options.length
  for (let k = 1; k <= n; k++) {
    const i = (from + dir * k + n * k) % n
    if (!isDisabled(props.options[i])) return i
  }
  return -1
}

function edge(dir) {
  const n = props.options.length
  const start = dir > 0 ? -1 : n
  return step(start, dir) // from just outside the edge, inward
}

async function focusAndSelect(i) {
  if (i < 0) return
  select(i)
  await nextTick()
  buttons.value[i]?.focus()
}

function onKeydown(event, index) {
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      focusAndSelect(step(index, 1))
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      focusAndSelect(step(index, -1))
      break
    case 'Home':
      event.preventDefault()
      focusAndSelect(edge(1))
      break
    case 'End':
      event.preventDefault()
      focusAndSelect(edge(-1))
      break
    case ' ':
    case 'Enter':
      event.preventDefault()
      select(index)
      break
  }
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="labelledby ? undefined : label || undefined"
    :aria-labelledby="labelledby || undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="cn(
      'gap-0.5 rounded-lg bg-muted p-0.5',
      block ? 'flex w-full' : 'inline-flex',
    )"
  >
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      :ref="(el) => { buttons[i] = el }"
      type="button"
      role="radio"
      :aria-checked="model === opt.value ? 'true' : 'false'"
      :disabled="isDisabled(opt)"
      :tabindex="i === tabStop ? 0 : -1"
      :data-value="opt.value"
      :class="cn(
        'inline-flex min-h-[var(--touch-target)] items-center justify-center gap-1.5 rounded-md',
        'px-[var(--density-pad-x)] text-[length:var(--fs-sm)] font-semibold leading-none',
        'transition-colors duration-fast outline-none select-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        block && 'flex-1',
        model === opt.value
          ? 'bg-primary text-primary-foreground shadow-xs'
          : 'text-fg3 hover:text-fg1',
      )"
      @click="select(i)"
      @keydown="onKeydown($event, i)"
    >
      <slot name="option" :option="opt" :checked="model === opt.value">{{ opt.label }}</slot>
    </button>
  </div>
</template>
