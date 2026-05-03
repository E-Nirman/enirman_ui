<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '../../../../lib/utils.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  minYear: { type: Number, default: 1970 },
  maxYear: { type: Number, default: 2100 },
})
const emit = defineEmits(['update:modelValue', 'select'])

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const view = ref('day') // 'day' | 'month' | 'year'

const today = new Date()
const todayY = today.getFullYear()
const todayM = today.getMonth()
const todayD = today.getDate()

function parseAd(str) {
  if (!str) return null
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = +m[1], mo = +m[2] - 1, d = +m[3]
  if (mo < 0 || mo > 11 || d < 1 || d > 31) return null
  return { y, m: mo, d }
}

function formatAd(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const selected = computed(() => parseAd(props.modelValue))

const cursorY = ref(selected.value?.y ?? todayY)
const cursorM = ref(selected.value?.m ?? todayM)

watch(
  () => props.modelValue,
  (v) => {
    const parsed = parseAd(v)
    if (parsed) {
      cursorY.value = parsed.y
      cursorM.value = parsed.m
    }
  },
)

const daysInMonth = computed(() => new Date(cursorY.value, cursorM.value + 1, 0).getDate())
const firstWeekday = computed(() => new Date(cursorY.value, cursorM.value, 1).getDay())

const calendarCells = computed(() => {
  const cells = []
  for (let i = 0; i < firstWeekday.value; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth.value; d++) cells.push(d)
  return cells
})

const yearList = computed(() => {
  const out = []
  for (let y = props.maxYear; y >= props.minYear; y--) out.push(y)
  return out
})

const canGoPrev = computed(() => cursorY.value > props.minYear || cursorM.value > 0)
const canGoNext = computed(() => cursorY.value < props.maxYear || cursorM.value < 11)

function prevMonth() {
  if (!canGoPrev.value) return
  if (cursorM.value === 0) { cursorM.value = 11; cursorY.value-- } else { cursorM.value-- }
}
function nextMonth() {
  if (!canGoNext.value) return
  if (cursorM.value === 11) { cursorM.value = 0; cursorY.value++ } else { cursorM.value++ }
}
function selectYear(y) { cursorY.value = y; view.value = 'month' }
function selectMonth(m) { cursorM.value = m; view.value = 'day' }

function isToday(d) {
  return cursorY.value === todayY && cursorM.value === todayM && d === todayD
}
function isSelected(d) {
  const s = selected.value
  return s && cursorY.value === s.y && cursorM.value === s.m && d === s.d
}
function isSaturday(idx) { return (idx + 1) % 7 === 0 }

function pickDay(d) {
  const value = formatAd(cursorY.value, cursorM.value, d)
  emit('update:modelValue', value)
  emit('select', value)
}

function pickToday() {
  cursorY.value = todayY
  cursorM.value = todayM
  pickDay(todayD)
}
</script>

<template>
  <div class="w-64 select-none">
    <!-- YEAR PICKER -->
    <div v-if="view === 'year'">
      <button
        type="button"
        class="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium border-b border-border hover:bg-accent"
        @click="view = 'day'"
      >
        <ChevronLeft class="h-4 w-4" />
        <span>Year</span>
      </button>
      <div class="max-h-64 overflow-auto">
        <div class="grid grid-cols-4 p-2 gap-0.5">
          <button
            v-for="y in yearList"
            :key="y"
            type="button"
            :class="cn(
              'py-2 text-sm rounded text-center transition-colors',
              y === cursorY ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent',
            )"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>
      </div>
    </div>

    <!-- MONTH PICKER -->
    <div v-else-if="view === 'month'">
      <button
        type="button"
        class="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium border-b border-border hover:bg-accent"
        @click="view = 'year'"
      >
        <ChevronLeft class="h-4 w-4" />
        <span>{{ cursorY }}</span>
      </button>
      <div class="grid grid-cols-3 p-2 gap-0.5">
        <button
          v-for="(name, idx) in MONTH_NAMES"
          :key="idx"
          type="button"
          :class="cn(
            'py-2 px-1 text-sm text-center rounded transition-colors',
            idx === cursorM ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent',
          )"
          @click="selectMonth(idx)"
        >
          {{ name.slice(0, 3) }}
        </button>
      </div>
    </div>

    <!-- DAY GRID -->
    <div v-else>
      <div class="flex items-center justify-between px-1 pt-1">
        <button
          type="button"
          class="flex items-center justify-center size-8 rounded hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!canGoPrev"
          @click="prevMonth"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent"
          @click="view = 'year'"
        >
          {{ MONTH_NAMES[cursorM] }} {{ cursorY }}
        </button>
        <button
          type="button"
          class="flex items-center justify-center size-8 rounded hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!canGoNext"
          @click="nextMonth"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>

      <div class="grid grid-cols-7 mt-1 border-y border-border">
        <span
          v-for="(wd, i) in WEEKDAY_HEADERS"
          :key="wd"
          :class="cn(
            'flex items-center justify-center py-1 text-[10px] font-medium',
            i === 6 ? 'text-destructive' : 'text-muted-foreground',
          )"
        >
          {{ wd }}
        </span>
      </div>

      <div class="grid grid-cols-7 p-1 gap-px" role="grid">
        <template v-for="(day, idx) in calendarCells" :key="idx">
          <div v-if="day === null" class="aspect-square" role="gridcell" />
          <button
            v-else
            type="button"
            :class="cn(
              'flex items-center justify-center aspect-square rounded text-sm transition-colors',
              isSaturday(idx) && !isSelected(day) ? 'text-destructive' : '',
              !isSelected(day) && !isSaturday(idx) ? 'text-foreground' : '',
              isToday(day) && !isSelected(day) ? 'ring-1 ring-primary font-semibold' : '',
              isSelected(day) ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-accent cursor-pointer',
            )"
            role="gridcell"
            :aria-selected="isSelected(day)"
            :aria-current="isToday(day) ? 'date' : undefined"
            @click="pickDay(day)"
          >
            {{ day }}
          </button>
        </template>
      </div>

      <div class="border-t border-border p-1">
        <button
          type="button"
          class="w-full py-1.5 text-sm text-foreground rounded hover:bg-accent"
          @click="pickToday"
        >
          Today
        </button>
      </div>
    </div>
  </div>
</template>
