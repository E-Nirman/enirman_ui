/*
 * useNepaliCalendarLib — lazy loader for nepal_compliance's
 * `nepali_date_lib.js` (a Universal Module Definition / UMD bundle that
 * sets `window.NepaliDateLib`).
 *
 * The conversion data (BS month lengths) is corrected by nepal_compliance
 * from time to time. By fetching the file from the bench's asset URL at
 * runtime, every `bench update` propagates fixes without a frontend
 * rebuild — and without making @enirman/ui a hard dependent of
 * nepal_compliance source code.
 *
 * Usage:
 *   import { loadNepaliCalendarLib } from '@enirman/ui'
 *   const { NepaliDate, NepaliCalendar, formatNumber } =
 *     await loadNepaliCalendarLib()
 *
 * If the script can't load (e.g. nepal_compliance isn't installed on the
 * bench), the promise rejects. Calendar components catch and fall back
 * to AD mode.
 */

const ASSET_URL = '/assets/nepal_compliance/js/nepali_date_lib.js'
const SCRIPT_ID = 'enirman-ui-nepali-date-lib'
const LOAD_TIMEOUT_MS = 10000

let cachedPromise = null

function injectScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      reject(new Error('Nepali calendar lib requires a browser environment'))
      return
    }

    if (window.NepaliDateLib) {
      resolve(window.NepaliDateLib)
      return
    }

    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.NepaliDateLib) resolve(window.NepaliDateLib)
        else reject(new Error('NepaliDateLib not found on window after script load'))
      })
      existing.addEventListener('error', () => reject(new Error('Nepali calendar lib failed to load')))
      return
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = ASSET_URL
    script.async = true

    const timeout = setTimeout(() => {
      reject(new Error(`Nepali calendar lib load timed out after ${LOAD_TIMEOUT_MS}ms`))
    }, LOAD_TIMEOUT_MS)

    script.onload = () => {
      clearTimeout(timeout)
      if (window.NepaliDateLib) resolve(window.NepaliDateLib)
      else reject(new Error('NepaliDateLib not found on window after script load'))
    }

    script.onerror = () => {
      clearTimeout(timeout)
      reject(new Error(`Nepali calendar lib failed to load from ${ASSET_URL}`))
    }

    document.head.appendChild(script)
  })
}

export function loadNepaliCalendarLib() {
  if (!cachedPromise) {
    cachedPromise = injectScript().catch((err) => {
      cachedPromise = null
      throw err
    })
  }
  return cachedPromise
}

export function getNepaliCalendarLibSync() {
  if (typeof window !== 'undefined' && window.NepaliDateLib) {
    return window.NepaliDateLib
  }
  return null
}