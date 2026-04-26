<template>
  <div ref="hostRef" class="cad-viewer-host" :class="{ 'is-dark': isDark }">
    <MlCadViewer
      :key="url"
      :url="url"
      :background="canvasBg"
      :mode="mode"
      :base-url="cadBaseUrl"
      :theme="cadTheme"
    />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, computed } from 'vue'
import { useDark } from '@vueuse/core'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { MlCadViewer, i18n as cadI18n } from '@mlightcad/cad-viewer'
import {
  AcApDocManager,
  AcApSettingManager,
} from '@mlightcad/cad-simple-viewer'

defineOptions({ name: 'EuiDwgViewer' })

const props = defineProps({
  url: { type: String, required: true },
  mode: { type: Number, default: 0 },
})

const hostRef = ref(null)

const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const cadTheme = computed(() => (isDark.value ? 'dark' : 'light'))
const canvasBg = computed(() => (isDark.value ? 0x1f2937 : 0xf1f3f5))

const assetBase = `${window.location.origin}${import.meta.env.BASE_URL}`
const workerUrls = {
  dwgParser: `${assetBase}cad-workers/libredwg-parser-worker.js`,
  mtextRender: `${assetBase}cad-workers/mtext-renderer-worker.js`,
}
const cadBaseUrl = `${assetBase}cad-data/`

// Silence the library's mtext render errors. The library throws a
// TypeError ("morphAttributes null") when a DWG text block mixes a
// missing font with a fallback, producing incompatible BufferGeometry
// attributes. We map most Windows fonts via AcApSettingManager, but
// some drawings still contain fonts we can't map; we'd rather skip
// rendering those specific text blocks than flood the console.
if (!window.__enirmanCadErrorsSilenced) {
  const origError = console.error.bind(console)
  console.error = function (...args) {
    const first = args[0]
    const msg = typeof first === 'string' ? first : first?.message
    if (
      typeof msg === 'string' &&
      (msg.startsWith('Failed to render mtext') ||
        msg.includes('morphAttributes'))
    ) {
      return
    }
    return origError(...args)
  }
  const origWarn = console.warn.bind(console)
  console.warn = function (...args) {
    const first = args[0]
    if (
      typeof first === 'string' &&
      (first.startsWith('THREE.BufferGeometryUtils:') ||
        first.includes('mergeGeometries'))
    ) {
      return
    }
    return origWarn(...args)
  }
  window.addEventListener('unhandledrejection', (e) => {
    const msg = e.reason?.message || ''
    if (msg.includes('morphAttributes') || msg.startsWith('Worker error')) {
      e.preventDefault()
    }
  })
  window.__enirmanCadErrorsSilenced = true
}

// Redirect the library's hardcoded gitlab.io font URL to our local
// copy. Catches any font manager that didn't pick up baseUrl.
if (!window.__enirmanCadFetchPatched) {
  const orig = window.fetch.bind(window)
  const remotePrefix = 'https://mlightcad.gitlab.io/cad-data/'
  window.fetch = function (input, init) {
    try {
      const urlStr = typeof input === 'string' ? input : input?.url
      if (urlStr && urlStr.startsWith(remotePrefix)) {
        return orig(cadBaseUrl + urlStr.slice(remotePrefix.length), init)
      }
    } catch {}
    return orig(input, init)
  }
  window.__enirmanCadFetchPatched = true
}

if (!AcApDocManager.__patchedForEnirman) {
  const original = AcApDocManager.createInstance.bind(AcApDocManager)
  AcApDocManager.createInstance = function patchedCreate(opts = {}) {
    return original({
      ...opts,
      webworkerFileUrls: {
        ...(opts.webworkerFileUrls || {}),
        ...workerUrls,
      },
    })
  }
  AcApDocManager.__patchedForEnirman = true
}

const app = getCurrentInstance()?.appContext?.app
if (app && !app.__cadViewerRegistered) {
  app.use(ElementPlus)
  app.use(cadI18n)
  app.__cadViewerRegistered = true
}

const s = AcApSettingManager.instance
// Always show the vertical toolbar and command line — they contain view
// tools (zoom, pan, fit, measure, layers) that all tiers need, not just
// edit tools. Mode-prop already gates what actions the user can commit.
s.set('isShowToolbar', true)
s.set('isShowCommandLine', true)
s.set('isShowCoordinate', true)
s.set('isShowEntityInfo', true)
s.set('isShowMainMenu', false)
s.set('isShowStats', false)
s.set('isShowLanguageSelector', false)
s.set('isShowFileName', false)

// Map common Windows fonts that DWG files reference (via embedded
// `\fFontName|...` directives) onto fonts we actually ship. Without
// this, the library tries to load a missing font, hits an internal
// code path that produces mismatched BufferGeometry attributes, and
// crashes with "morphAttributes null" — so the whole text block
// fails to render. Keys are case-insensitive in EP/library lookup.
s.set('fontMapping', {
  'Arial': 'simplex',
  'Arial Narrow': 'simplex',
  'ArialNarrow': 'simplex',
  'Times': 'romans',
  'Times New Roman': 'romans',
  'TimesNewRoman': 'romans',
  'Tahoma': 'simplex',
  'Courier': 'monotxt',
  'Courier New': 'monotxt',
  'Verdana': 'simplex',
  'Calibri': 'simplex',
  'Helvetica': 'simplex',
  'Technic': 'simplex',
  'Technic_': 'simplex',
  'Bodoni MT Condensed': 'romans',
  'Gothic': 'italic',
  'Comic': 'simplex',
  'Dutch801 Rm BT': 'romans',
  'Dutch': 'romans',
  'bkant': 'romans',
  'courbd': 'monotxt',
  'arialn': 'simplex',
})
</script>

<style>
.cad-viewer-host {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--surface-gray-1, #f1f3f5);
  /* `transform` creates a containing block for `position: fixed`
     descendants. The library's status bar / command line / notification
     center are all position:fixed bottom:0 right:0, which would escape
     to the viewport otherwise and stretch across the sidebar+workflow
     rail. `will-change: transform` keeps it on its own layer. */
  transform: translateZ(0);
  will-change: transform;
}
.cad-viewer-host.is-dark {
  background: #1f2937;
}
.cad-viewer-host:fullscreen,
.cad-viewer-host:-webkit-full-screen {
  width: 100vw;
  height: 100vh;
}

.cad-viewer-host .ml-cad-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  /* Leave room for the 30px status bar at the bottom so the canvas
     doesn't sit flush against the bottom chrome. The library uses
     calc(100vh - 30px); we rescale to the host height instead. */
  height: calc(100% - var(--ml-status-bar-height, 30px)) !important;
}
/* UI overlay must pass pointer events to canvas below. */
.cad-viewer-host .ml-cad-viewer-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
}
.cad-viewer-host .ml-cad-viewer-container > header,
.cad-viewer-host .ml-cad-viewer-container > footer,
.cad-viewer-host .ml-vertical-toolbar-container,
.cad-viewer-host .ml-cli-container,
.cad-viewer-host .ml-file-name,
.cad-viewer-host .ml-ccl-overlay,
.cad-viewer-host .ml-notification-center,
.cad-viewer-host .el-dropdown,
.cad-viewer-host .el-tooltip__trigger,
.cad-viewer-host button,
.cad-viewer-host .el-dialog,
.cad-viewer-host .el-overlay {
  pointer-events: auto;
}

/* Aggressive reset so Tailwind preflight stops collapsing EP icons. */
.cad-viewer-host svg {
  display: inline-block !important;
  vertical-align: middle;
  fill: currentColor;
  color: inherit;
}
.cad-viewer-host .el-icon {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: inherit;
}
.cad-viewer-host .el-icon svg {
  width: 1em !important;
  height: 1em !important;
  fill: currentColor !important;
}
.cad-viewer-host .el-icon svg * {
  fill: currentColor;
}
.cad-viewer-host .el-button {
  color: var(--el-text-color-regular, #303133);
}
/* The vertical toolbar and its buttons should follow EP's theme color
   so icons aren't dark-on-dark in dark mode. Frappe-ui's Tailwind
   preset `@apply`s its own palette to buttons, which can leave the
   icon text color fixed regardless of the active EP theme. */
.cad-viewer-host .ml-vertical-toolbar-container .el-button,
.cad-viewer-host .ml-toolbar-button,
.cad-viewer-host .ml-toolbar-button .el-icon,
.cad-viewer-host .ml-status-bar .el-button,
.cad-viewer-host .ml-status-bar .el-icon {
  color: var(--el-text-color-regular, #606266) !important;
}
.cad-viewer-host .ml-vertical-toolbar-container .el-button:hover,
.cad-viewer-host .ml-toolbar-button:hover,
.cad-viewer-host .ml-status-bar .el-button:hover {
  color: var(--el-color-primary, #409eff) !important;
}

/* Hide overlay pieces that duplicate our app chrome. */
.cad-viewer-host .ml-file-name,
.cad-viewer-host .ml-main-menu-container,
.cad-viewer-host .ml-cad-viewer-container > header {
  display: none !important;
}
/* Hide the library's dark-mode and fullscreen toggles. Within the
   status-bar right group, the first two `.ml-toggle-button` elements
   are dark-mode (moon) and fullscreen. The remaining `.ml-toggle-button`
   entries (line-width, dynamic input) should stay visible. */
.cad-viewer-host .ml-status-bar-right-button-group .ml-toggle-button:nth-of-type(1),
.cad-viewer-host .ml-status-bar-right-button-group .ml-toggle-button:nth-of-type(2) {
  display: none !important;
}

/* Popovers / dropdowns / tooltips from Element Plus teleport to <body>,
   so they sit OUTSIDE `.cad-viewer-host` and its scoped styles don't
   apply. Target them globally and make sure they layer above the app
   workflow rail (which we noticed sits at z-index ~50) and render
   pointer events. Also restore icon visibility inside the popper
   content since it can contain `.el-icon svg` too. */
.el-popper,
.el-dropdown-menu,
.el-tooltip__popper {
  z-index: 9999 !important;
  pointer-events: auto !important;
}
.el-popper .el-icon,
.el-dropdown-menu .el-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.el-popper .el-icon svg,
.el-dropdown-menu .el-icon svg,
.el-popper svg,
.el-dropdown-menu svg {
  display: inline-block !important;
  width: 1em !important;
  height: 1em !important;
  fill: currentColor;
  color: inherit;
}
</style>
