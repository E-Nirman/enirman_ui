<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '../../../../lib/utils.js'
import { loadNepaliCalendarLib } from '../../../../composables/useNepaliCalendarLib.js'

/*
 * Bikram Sambat (BS) calendar grid. Reads/writes AD `YYYY-MM-DD`
 * strings via `modelValue` so it can be a drop-in alternative to
 * AdCalendarPanel — the parent picker doesn't have to know which one
 * is rendered.
 */

const props = defineProps({
  modelValue: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'select', 'load-error'])

const lib = ref(null)
const loadFailed = ref(false)
const view = ref('day') // 'day' | 'month' | 'year'

const cursorYear = ref(0)
const cursorMonthIndex = ref(0)

onMounted(async () => {
  try {
    const loaded = await loadNepaliCalendarLib()
    lib.value = loaded
    initFromValue(props.modelValue)
  } catch (err) {
    loadFailed.value = true
    emit('load-error', err)
  }
})

// All AD↔BS conversions are pinned to UTC midnight. The lib's internal
// AD→BS path (NepaliDate.fromAD) uses Date.getTime() — i.e. UTC
// milliseconds — and floors days since a UTC-midnight epoch. Constructing
// dates with `new Date(y, m, d)` (local-midnight) silently shifts the
// result back one day in zones west of UTC and forward one day in zones
// far east of UTC. `Date.UTC(y, m, d)` produces exactly UTC midnight, and
// the lib's toAD() returns UTC-midnight Dates the same way.

function adToBs(adString) {
  if (!adString || !lib.value) return null
  try {
    const [y, m, d] = adString.split('-').map(Number)
    const date = new Date(Date.UTC(y, m - 1, d))
    return lib.value.NepaliDate.fromAD(date)
  } catch {
    return null
  }
}

function bsToAd(nd) {
  const ad = nd.toAD()
  const y = ad.getUTCFullYear()
  const m = String(ad.getUTCMonth() + 1).padStart(2, '0')
  const d = String(ad.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function initFromValue(adString) {
  if (!lib.value) return
  const nd = adToBs(adString)
  const today = new lib.value.NepaliDate()
  cursorYear.value = nd ? nd.year : today.year
  cursorMonthIndex.value = nd ? nd.monthIndex : today.monthIndex
}

watch(
  () => props.modelValue,
  (v) => initFromValue(v),
)

const calendar = computed(() => {
  if (!lib.value) return null
  return new lib.value.NepaliCalendar(cursorYear.value)
})

const monthData = computed(() => {
  if (!calendar.value) return null
  return calendar.value.getMonth(cursorMonthIndex.value)
})

const calendarDays = computed(() => monthData.value?.days ?? [])

const currentMonthNp = computed(() => monthData.value?.month?.np ?? '')
const currentMonthAd = computed(() => monthData.value?.month?.ad ?? '')

const currentAdYear = computed(() => {
  if (!calendar.value) return ''
  return calendar.value.getMonthAdYear(cursorMonthIndex.value)
})

const today = computed(() => (lib.value ? new lib.value.NepaliDate() : null))

const bsMonths = computed(() => lib.value?.BS_MONTHS_WITH_AD ?? [])
const weekdayHeaders = computed(() => lib.value?.WEEKDAY_SHORT_NE ?? ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'])

const yearList = computed(() => {
  if (!lib.value) return []
  return [...lib.value.NepaliCalendar.years].reverse()
})

const canGoPrev = computed(() => {
  if (!lib.value) return false
  return cursorYear.value > lib.value.NepaliCalendar.minYear || cursorMonthIndex.value > 0
})
const canGoNext = computed(() => {
  if (!lib.value) return false
  return cursorYear.value < lib.value.NepaliCalendar.maxYear || cursorMonthIndex.value < 11
})

function formatNum(n) {
  if (!lib.value) return String(n)
  return lib.value.formatNumber(n, 'ne')
}

function isToday(day) {
  if (!day?.date || !today.value) return false
  return (
    day.date.year === today.value.year &&
    day.date.monthIndex === today.value.monthIndex &&
    day.date.day === today.value.day
  )
}

function isSelected(day) {
  if (!day?.date || !props.modelValue) return false
  const dayAd = day.date.format({ format: 'YYYY-MM-DD', calendar: 'AD' })
  return dayAd === props.modelValue
}

function isSaturday(flatIndex) { return (flatIndex + 1) % 7 === 0 }

function pickDay(day) {
  if (!day?.date) return
  const ad = bsToAd(day.date)
  cursorYear.value = day.date.year
  cursorMonthIndex.value = day.date.monthIndex
  emit('update:modelValue', ad)
  emit('select', ad)
}

function pickToday() {
  if (!today.value) return
  const ad = bsToAd(today.value)
  cursorYear.value = today.value.year
  cursorMonthIndex.value = today.value.monthIndex
  emit('update:modelValue', ad)
  emit('select', ad)
}

function prevMonth() {
  if (!canGoPrev.value) return
  if (cursorMonthIndex.value === 0) {
    cursorMonthIndex.value = 11
    cursorYear.value--
  } else {
    cursorMonthIndex.value--
  }
}
function nextMonth() {
  if (!canGoNext.value) return
  if (cursorMonthIndex.value === 11) {
    cursorMonthIndex.value = 0
    cursorYear.value++
  } else {
    cursorMonthIndex.value++
  }
}
function selectYear(y) { cursorYear.value = y; view.value = 'month' }
function selectMonth(idx) { cursorMonthIndex.value = idx; view.value = 'day' }
</script>

<template>
  <div class="w-64 select-none">
    <!-- Loading skeleton while lib is fetching -->
    <div
      v-if="!lib && !loadFailed"
      class="flex items-center justify-center py-8 text-xs text-muted-foreground"
    >
      Loading calendar…
    </div>

    <template v-else-if="lib">
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
                y === cursorYear ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent',
              )"
              @click="selectYear(y)"
            >
              {{ formatNum(y) }}
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
          <span>{{ formatNum(cursorYear) }}</span>
        </button>
        <div class="grid grid-cols-3 p-2 gap-0.5">
          <button
            v-for="(entry, idx) in bsMonths"
            :key="idx"
            type="button"
            :class="cn(
              'py-2 px-1 text-center rounded transition-colors',
              idx === cursorMonthIndex ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-accent',
            )"
            @click="selectMonth(idx)"
          >
            <p class="text-xs font-medium">{{ entry.np }}</p>
            <p class="text-[10px] opacity-70">{{ entry.ad }}</p>
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
            class="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent"
            @click="view = 'year'"
          >
            <span>{{ formatNum(cursorYear) }}</span>
            <span class="text-[10px] text-muted-foreground">| {{ currentAdYear }}</span>
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

        <div class="flex items-center justify-between px-2 pb-1">
          <span class="text-xs font-medium text-foreground">{{ currentMonthNp }}</span>
          <span class="text-[10px] text-muted-foreground">{{ currentMonthAd }}</span>
        </div>

        <div class="grid grid-cols-7 border-y border-border">
          <span
            v-for="(wd, i) in weekdayHeaders"
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
          <template v-for="(day, idx) in calendarDays" :key="idx">
            <div v-if="!day" class="aspect-square" role="gridcell" />
            <button
              v-else
              type="button"
              :class="cn(
                'relative flex items-center justify-center aspect-square rounded text-sm transition-colors',
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
              {{ day.np }}
              <span
                class="absolute bottom-0.5 right-0.5 text-[7px] opacity-50 leading-none"
                aria-hidden="true"
              >
                {{ day.ad }}
              </span>
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
    </template>
  </div>
</template>
