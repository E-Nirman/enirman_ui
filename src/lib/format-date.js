/*
 * BS-aware date / time formatters.
 *
 * `formatDate`, `formatDateTime`, `formatTimeAgo` are sync functions safe
 * to call from any Vue render. When `bsMode` is true and the lazy-loaded
 * nepali_date_lib is ready, they emit BS-formatted output; otherwise
 * they fall through to AD (so cells never go blank while the lib is
 * still loading or on benches without nepal_compliance installed).
 *
 * `useDateFormat()` is the canonical Vue composable: it reads `bsMode`
 * via inject() and returns the same three formatters pre-bound. Use
 * this from any consumer — eNirman apps wire `app.provide('bsMode', …)`
 * once at root, and every formatter call downstream picks it up.
 *
 * Reactivity: when bsMode is true and the lib finishes loading,
 * `nepaliCalendarReady` flips to true; any render that called these
 * formatters re-runs and switches from AD fallback to BS output.
 */

import { ref, inject, unref } from 'vue'
import {
  loadNepaliCalendarLib,
  getNepaliCalendarLibSync,
} from '../composables/useNepaliCalendarLib.js'

export const nepaliCalendarReady = ref(!!getNepaliCalendarLibSync())

let warming = false
function ensureNepaliCalendarLib() {
  if (nepaliCalendarReady.value || warming) return
  warming = true
  loadNepaliCalendarLib()
    .then(() => { nepaliCalendarReady.value = true })
    .catch(() => { warming = false })
}

// Compact "30 Apr 2026" / "30 Apr 2026, 15:42" — matches the format
// most callsites in eNirman apps use today (en-GB DD MMM YYYY) so
// rolling existing inline formatters onto this helper isn't a visual
// regression. Locale is hardcoded to en-GB on purpose so users see
// the same string regardless of browser locale.
const AD_DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
})
const AD_DATETIME_FMT = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: false,
})
const AD_TIME_FMT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', hour12: false,
})

function toDate(value) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

// AD strings ("YYYY-MM-DD" or "YYYY-MM-DD HH:mm:ss") need to land on
// UTC midnight before going through NepaliDate.fromAD — see the picker
// fix from 1.2.2 (without UTC pinning, NPT clocks shift the day back
// by 5h45m and BS conversion comes out one day off).
function toUtcMidnightDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) {
    return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  }
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatBsDate(value) {
  const lib = getNepaliCalendarLibSync()
  if (!lib) return null
  const date = toUtcMidnightDate(value)
  if (!date) return null
  try {
    const nd = lib.NepaliDate.fromAD(date)
    return nd.format({ format: 'YYYY-MM-DD', calendar: 'BS', locale: 'en' })
  } catch (_e) {
    return null
  }
}

export function formatDate(value, { bsMode = false } = {}) {
  if (!value) return ''
  if (bsMode) {
    // Reading the ref makes the surrounding render reactive: when the
    // lib finishes loading, every cell using this formatter repaints.
    if (nepaliCalendarReady.value) {
      const bs = formatBsDate(value)
      if (bs) return bs
    } else {
      ensureNepaliCalendarLib()
    }
  }
  const d = toDate(value)
  return d ? AD_DATE_FMT.format(d) : ''
}

export function formatDateTime(value, { bsMode = false } = {}) {
  if (!value) return ''
  const d = toDate(value)
  if (!d) return ''
  if (bsMode) {
    if (nepaliCalendarReady.value) {
      const bs = formatBsDate(value)
      if (bs) return `${bs} ${AD_TIME_FMT.format(d)}`
    } else {
      ensureNepaliCalendarLib()
    }
  }
  return AD_DATETIME_FMT.format(d)
}

const RELATIVE_UNITS = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]
const RELATIVE_FMT = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

export function formatTimeAgo(value) {
  const d = toDate(value)
  if (!d) return ''
  const deltaSec = Math.round((d.getTime() - Date.now()) / 1000)
  const absSec = Math.abs(deltaSec)
  for (const [unit, secs] of RELATIVE_UNITS) {
    if (absSec >= secs) {
      return RELATIVE_FMT.format(Math.round(deltaSec / secs), unit)
    }
  }
  return RELATIVE_FMT.format(deltaSec, 'second')
}

export function useDateFormat() {
  const bsMode = inject('bsMode', false)
  return {
    formatDate:     (v) => formatDate(v,     { bsMode: !!unref(bsMode) }),
    formatDateTime: (v) => formatDateTime(v, { bsMode: !!unref(bsMode) }),
    formatTimeAgo,
  }
}
