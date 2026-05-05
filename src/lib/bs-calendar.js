/*
 * BS calendar walk helpers — useful when a chart needs to render
 * Bikram Sambat month / quarter ticks across an AD date window
 * (Gantt views, timelines, fiscal-year axes, etc).
 *
 * The lib (`nepali_date_lib.js`, lazy-loaded from nepal_compliance) is
 * the single source of truth for BS month lengths, so corrections like
 * the 32-day-Asar fix flow in via `bench update` without a frontend
 * rebuild.
 *
 * All entry points return null when the lib isn't loaded yet — caller
 * is expected to fall back to AD ticks until `nepaliCalendarReady`
 * flips and the next render retries.
 */

import { getNepaliCalendarLibSync } from '../composables/useNepaliCalendarLib.js'

export const BS_MONTH_NAMES_EN = [
  'Baishakh', 'Jestha',  'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik',   'Mangsir', 'Poush',  'Magh',    'Falgun', 'Chaitra',
]

// 3-letter shorts. 'Asa' (Ashadh, BS month 3) and 'Ash' (Ashwin, BS
// month 6) both start with A in English; the third letter
// disambiguates them — necessary because both appear in any chart axis
// covering > 6 months.
export const BS_MONTH_SHORT_EN = [
  'Bai', 'Jet', 'Asa', 'Shr', 'Bha', 'Ash',
  'Kar', 'Man', 'Pou', 'Mag', 'Fal', 'Cha',
]

// BS quarters: Q1 = Bai-Jet-Asa (BS months 1-3), Q2 = Shr-Bha-Ash,
// Q3 = Kar-Man-Pou, Q4 = Mag-Fal-Cha. Q1 of BS year N starts in
// mid-April AD.
export const BS_QUARTER_LABELS_EN = ['Q1', 'Q2', 'Q3', 'Q4']

/**
 * Walk every BS month boundary that touches the AD window
 * [adStart, adEnd]. Anchors at the BS month containing adStart, even
 * if that month started before adStart.
 *
 * @returns Array<{ adStart: Date, days: number, year: number, monthIndex: number, label: string, labelWithYear: string }>
 *          or null if the lib isn't loaded.
 */
export function walkBsMonths(adStart, adEnd) {
  const lib = getNepaliCalendarLibSync()
  if (!lib) return null
  const startBs = lib.NepaliDate.fromAD(adStart)
  let year = startBs.year
  let monthIndex = startBs.monthIndex
  const ticks = []
  // Hard cap of 200 ticks defends against pathological inputs (decades
  // of window) — 200 BS months is ~16 BS years, far beyond any real
  // Gantt window.
  for (let i = 0; i < 200; i++) {
    const adAtStart = new lib.NepaliDate(year, monthIndex, 1).toAD()
    if (adAtStart > adEnd) break
    const days = lib.getDaysInMonth(year, monthIndex)
    const yy = String(year).slice(-2)
    const short = BS_MONTH_SHORT_EN[monthIndex]
    ticks.push({
      adStart: adAtStart,
      days,
      year,
      monthIndex,
      label: short,
      labelWithYear: `${short} '${yy}`,
    })
    monthIndex += 1
    if (monthIndex > 11) { monthIndex = 0; year += 1 }
  }
  return ticks
}

/**
 * Walk every BS quarter boundary that touches the AD window. Anchors
 * at the quarter containing adStart.
 *
 * @returns Array<{ adStart: Date, days: number, year: number, quarter: 1|2|3|4, label: string }>
 *          or null if the lib isn't loaded.
 */
export function walkBsQuarters(adStart, adEnd) {
  const lib = getNepaliCalendarLibSync()
  if (!lib) return null
  const startBs = lib.NepaliDate.fromAD(adStart)
  let year = startBs.year
  let qStartMonth = Math.floor(startBs.monthIndex / 3) * 3
  const ticks = []
  for (let i = 0; i < 80; i++) {
    const adAtStart = new lib.NepaliDate(year, qStartMonth, 1).toAD()
    if (adAtStart > adEnd) break
    let days = 0
    for (let m = 0; m < 3; m++) {
      days += lib.getDaysInMonth(year, qStartMonth + m)
    }
    const q = Math.floor(qStartMonth / 3) + 1
    const yy = String(year).slice(-2)
    ticks.push({
      adStart: adAtStart,
      days,
      year,
      quarter: q,
      label: `Q${q} '${yy}`,
    })
    qStartMonth += 3
    if (qStartMonth > 11) { qStartMonth = 0; year += 1 }
  }
  return ticks
}

/**
 * Compact BS month-day label for a single AD date — e.g. "Bai 22".
 * Returns null when lib not loaded.
 */
export function fmtBsMonthDay(adDate) {
  const lib = getNepaliCalendarLibSync()
  if (!lib) return null
  const nd = lib.NepaliDate.fromAD(adDate)
  return `${BS_MONTH_SHORT_EN[nd.monthIndex]} ${nd.day}`
}

/**
 * Compact BS month label for a single AD date. Multi-year forms
 * include the year suffix — `multiYear=true` → "Bai '83", else just
 * "Bai".
 */
export function fmtBsMonth(adDate, { multiYear = false } = {}) {
  const lib = getNepaliCalendarLibSync()
  if (!lib) return null
  const nd = lib.NepaliDate.fromAD(adDate)
  const short = BS_MONTH_SHORT_EN[nd.monthIndex]
  return multiYear ? `${short} '${String(nd.year).slice(-2)}` : short
}
