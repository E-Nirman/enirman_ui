<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue'
import { Calendar as CalendarIcon, X, Clock } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '../popover'
import { cn } from '../../../lib/utils.js'
import AdCalendarPanel from './internal/AdCalendarPanel.vue'
import NepaliCalendarPanel from './internal/NepaliCalendarPanel.vue'
import { loadNepaliCalendarLib } from '../../../composables/useNepaliCalendarLib.js'

/*
 * EuiDateTimePicker — date + time picker.
 *
 * modelValue is a single AD string in the form `YYYY-MM-DD HH:mm:ss`
 * (or an empty string when unset). Internally split into date and time
 * parts: the calendar panel updates the date half, a `<input type="time">`
 * below it updates the time half.
 *
 * Same `bsMode` semantics as EuiDatePicker.
 */

const props = defineProps({
  modelValue: { type: String, default: '' },
  bsMode: { type: Boolean, default: undefined },
  placeholder: { type: String, default: 'Select date and time' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  align: { type: String, default: 'start' },
  inputClass: { type: [String, Array, Object], default: '' },
  defaultTime: { type: String, default: '09:00' },
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
  try {
    await loadNepaliCalendarLib()
    nepaliLibAvailable.value = true
  } catch {
    nepaliLibAvailable.value = false
  }
})

const open = ref(false)

function splitDateTime(value) {
  if (!value) return { date: '', time: '' }
  const [date = '', timeRaw = ''] = value.split(' ')
  // Time may be HH:mm:ss; strip seconds for the input but keep them for output
  const time = timeRaw ? timeRaw.slice(0, 5) : ''
  return { date, time }
}

const datePart = ref('')
const timePart = ref('')

function syncFromValue(value) {
  const { date, time } = splitDateTime(value)
  datePart.value = date
  timePart.value = time
}

syncFromValue(props.modelValue)
watch(() => props.modelValue, (v) => syncFromValue(v))

function emitCombined(date, time) {
  if (!date) return
  const t = time || props.defaultTime
  const ts = `${t}:00`
  const out = `${date} ${ts}`
  emit('update:modelValue', out)
  emit('change', out)
}

function onPanelSelect(adDate) {
  datePart.value = adDate
  emitCombined(adDate, timePart.value)
}

function onPanelLoadError() {
  nepaliLibAvailable.value = false
}

function onTimeInput(e) {
  timePart.value = e.target.value
  if (datePart.value) emitCombined(datePart.value, timePart.value)
}

function clear() {
  datePart.value = ''
  timePart.value = ''
  emit('update:modelValue', '')
  emit('change', '')
}

function formatBsDisplay(adString) {
  if (!adString || typeof window === 'undefined' || !window.NepaliDateLib) return adString
  try {
    const [y, m, d] = adString.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    const nd = window.NepaliDateLib.NepaliDate.fromAD(date)
    return nd.format({ format: 'YYYY-MM-DD', calendar: 'BS', locale: 'en' })
  } catch {
    return adString
  }
}

const displayValue = computed(() => {
  if (!datePart.value) return ''
  const date = effectiveBsMode.value ? formatBsDisplay(datePart.value) : datePart.value
  return timePart.value ? `${date} ${timePart.value}` : date
})
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
        :model-value="datePart"
        @select="onPanelSelect"
        @load-error="onPanelLoadError"
      />
      <AdCalendarPanel
        v-else
        :model-value="datePart"
        @select="onPanelSelect"
      />

      <div class="flex items-center gap-2 border-t border-border p-2">
        <Clock class="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="time"
          :value="timePart"
          class="flex-1 h-7 rounded border border-input bg-card px-2 text-xs text-foreground focus:outline-none focus:border-ring focus:shadow-focus"
          @input="onTimeInput"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>
