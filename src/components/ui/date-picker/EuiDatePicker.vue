<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue'
import { Calendar as CalendarIcon, X } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '../popover'
import { cn } from '../../../lib/utils.js'
import AdCalendarPanel from './internal/AdCalendarPanel.vue'
import NepaliCalendarPanel from './internal/NepaliCalendarPanel.vue'
import { loadNepaliCalendarLib } from '../../../composables/useNepaliCalendarLib.js'

/*
 * EuiDatePicker — date picker that renders a Bikram Sambat (BS) or
 * Gregorian (AD) calendar based on `bsMode`.
 *
 * Always emits AD `YYYY-MM-DD` strings. BS is display-only — database
 * fields, API contracts, and reports continue to use AD.
 *
 * If `bsMode` is omitted, the component reads from `inject('bsMode')`,
 * which a consuming app can `provide()` at the root so callsites don't
 * need to pass the prop.
 *
 * If `bsMode` is true but the lazy-loaded `nepali_date_lib.js` fails
 * (e.g. nepal_compliance not installed on the bench), the picker
 * silently falls back to AD mode.
 */

const props = defineProps({
  modelValue: { type: String, default: '' },
  bsMode: { type: Boolean, default: undefined },
  placeholder: { type: String, default: 'Select date' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  align: { type: String, default: 'start' },
  inputClass: { type: [String, Array, Object], default: '' },
})
const emit = defineEmits(['update:modelValue', 'change'])

const injectedBsMode = inject('bsMode', null)
const nepaliLibAvailable = ref(false)

const effectiveBsMode = computed(() => {
  const flag = props.bsMode === undefined
    ? (injectedBsMode && 'value' in injectedBsMode ? injectedBsMode.value : injectedBsMode)
    : props.bsMode
  return Boolean(flag) && nepaliLibAvailable.value
})

onMounted(async () => {
  // Best-effort warm load. If it fails (e.g. nepal_compliance not
  // installed), bsMode silently degrades to AD mode.
  try {
    await loadNepaliCalendarLib()
    nepaliLibAvailable.value = true
  } catch {
    nepaliLibAvailable.value = false
  }
})

const open = ref(false)

function formatBsDisplay(adString) {
  if (!adString || typeof window === 'undefined' || !window.NepaliDateLib) return adString
  try {
    const [y, m, d] = adString.split('-').map(Number)
    // Construct as UTC midnight so the lib's fromAD (which uses getTime)
    // doesn't drift to the previous day in zones west of UTC such as NPT.
    const date = new Date(Date.UTC(y, m - 1, d))
    const nd = window.NepaliDateLib.NepaliDate.fromAD(date)
    return nd.format({ format: 'YYYY-MM-DD', calendar: 'BS', locale: 'en' })
  } catch {
    return adString
  }
}

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  return effectiveBsMode.value
    ? formatBsDisplay(props.modelValue)
    : props.modelValue
})

function onPanelSelect(adString) {
  emit('update:modelValue', adString)
  emit('change', adString)
  open.value = false
}

function onPanelLoadError() {
  // BS panel couldn't load the lib — flip to AD.
  nepaliLibAvailable.value = false
}

function clear() {
  emit('update:modelValue', '')
  emit('change', '')
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :disabled="disabled"
        :class="cn(
          'flex h-8 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-2.5 py-1 text-sm shadow-xs transition-[border-color,box-shadow] duration-fast ease-out-expo',
          'focus-visible:outline-none focus-visible:border-ring focus-visible:shadow-focus',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          'data-[state=open]:border-ring data-[state=open]:shadow-focus',
          props.inputClass,
        )"
      >
        <span :class="cn('truncate', displayValue ? 'text-foreground' : 'text-muted-foreground')">
          {{ displayValue || placeholder }}
        </span>
        <span class="flex items-center gap-1 shrink-0">
          <span
            v-if="clearable && modelValue && !disabled"
            role="button"
            tabindex="-1"
            class="text-muted-foreground hover:text-foreground"
            @click.stop="clear"
            @mousedown.prevent
          >
            <X class="h-3.5 w-3.5" />
          </span>
          <CalendarIcon class="h-4 w-4 text-muted-foreground" />
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent :align="align" :side-offset="6" class="w-auto p-0">
      <NepaliCalendarPanel
        v-if="effectiveBsMode"
        :model-value="modelValue"
        @select="onPanelSelect"
        @load-error="onPanelLoadError"
      />
      <AdCalendarPanel
        v-else
        :model-value="modelValue"
        @select="onPanelSelect"
      />
    </PopoverContent>
  </Popover>
</template>
