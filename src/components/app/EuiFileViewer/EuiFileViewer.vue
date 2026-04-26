<template>
  <div class="flex h-full flex-col overflow-hidden">

    <!-- ─── 3D RENDER mode: image gallery ─────────────────────────────── -->
    <template v-if="is3D">
      <div v-if="activeImages.length === 0" class="flex flex-1 flex-col items-center justify-center bg-surface-gray-1 p-6 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-gray-2">
          <Image class="size-8 text-ink-gray-4" />
        </div>
        <p class="text-sm font-medium text-ink-gray-7">No 3D renders uploaded yet</p>
        <p class="mt-1 text-xs text-ink-gray-4">Upload up to 5 images using the panel on the right</p>
      </div>
      <template v-else>
        <!-- Main selected image -->
        <div class="relative flex-1 overflow-hidden bg-ink-gray-9">
          <img
            :src="activeImages[activeImageIdx]"
            class="h-full w-full object-contain"
            :alt="`Render ${activeImageIdx + 1}`"
          />
          <!-- Nav arrows -->
          <button v-if="activeImages.length > 1 && activeImageIdx > 0"
            class="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            @click="activeImageIdx--">
            <ChevronLeft class="size-4" />
          </button>
          <button v-if="activeImages.length > 1 && activeImageIdx < activeImages.length - 1"
            class="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            @click="activeImageIdx++">
            <ChevronRight class="size-4" />
          </button>
          <!-- Top-right download -->
          <a :href="activeImages[activeImageIdx]" download
            class="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/40 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-black/60">
            <Download class="size-3" /> Download
          </a>
          <!-- Counter badge -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
            {{ activeImageIdx + 1 }} / {{ activeImages.length }}
          </div>
        </div>
        <!-- Thumbnails -->
        <div v-if="activeImages.length > 1" class="flex gap-1.5 overflow-x-auto border-t border-surface-gray-3 bg-surface-white p-2">
          <button
            v-for="(img, i) in activeImages" :key="img || i"
            class="h-12 w-12 flex-shrink-0 overflow-hidden rounded border-2 transition-all"
            :class="i === activeImageIdx ? 'border-blue-500' : 'border-transparent hover:border-surface-gray-3'"
            @click="activeImageIdx = i"
          >
            <img :src="img" class="h-full w-full object-cover" :alt="`Thumb ${i+1}`" />
          </button>
        </div>
      </template>
    </template>

    <!-- ─── STRUCTURAL mode: PDF + DWG + E2K ─────────────────────────── -->
    <!-- ─── ARCH / MUNICIPAL mode: PDF + DWG ─────────────────────────── -->
    <template v-else>

      <!-- Tab bar -->
      <div class="flex border-b border-surface-gray-3 bg-surface-white overflow-x-auto">
        <button v-if="hasPdf"
          class="flex flex-shrink-0 items-center gap-1.5 px-4 py-2 min-h-[44px] md:min-h-0 text-xs font-medium transition-colors"
          :class="activeFile === 'pdf' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-ink-gray-5 hover:text-ink-gray-8'"
          @click="activeFile = 'pdf'">
          <FileText class="size-3.5" /> PDF Drawing
        </button>
        <button v-if="hasDwg"
          class="flex flex-shrink-0 items-center gap-1.5 px-4 py-2 min-h-[44px] md:min-h-0 text-xs font-medium transition-colors"
          :class="activeFile === 'dwg' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-ink-gray-5 hover:text-ink-gray-8'"
          @click="activeFile = 'dwg'">
          <Box class="size-3.5" /> DWG Source
        </button>
        <button v-if="hasE2k"
          class="flex flex-shrink-0 items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors"
          :class="activeFile === 'e2k' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-ink-gray-5 hover:text-ink-gray-8'"
          @click="activeFile = 'e2k'">
          <Cpu class="size-3.5" /> E2K Analysis
        </button>
        <!-- No files label -->
        <span v-if="!hasPdf && !hasDwg && !hasE2k" class="px-4 py-2 text-xs text-ink-gray-4">No files</span>
      </div>

      <!-- PDF Viewer -->
      <div v-if="hasPdf && activeFile === 'pdf'" class="flex flex-1 flex-col overflow-hidden bg-surface-gray-1">
        <div class="flex items-center justify-between border-b border-surface-gray-3 bg-surface-white px-3 py-1.5">
          <span class="truncate max-w-xs text-xs text-ink-gray-6">{{ fileName(pdfUrl) }}</span>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <a :href="pdfUrl" target="_blank"
              class="flex items-center gap-1 rounded px-2 py-1 min-h-[44px] md:min-h-0 text-xs font-medium text-ink-gray-6 hover:bg-surface-gray-2">
              <Maximize2 class="size-3" /> <span class="hidden sm:inline">Full screen</span>
            </a>
            <a :href="pdfUrl" download
              class="flex items-center gap-1 rounded px-2 py-1 min-h-[44px] md:min-h-0 text-xs font-medium text-ink-gray-6 hover:bg-surface-gray-2">
              <Download class="size-3" /> <span class="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
        <div class="flex-1 overflow-hidden">
          <iframe :src="pdfUrl + '#toolbar=1&navpanes=0&scrollbar=1'"
            class="h-full w-full border-0" type="application/pdf" :title="fileName(pdfUrl)" />
        </div>
      </div>

      <!-- DWG Viewer (iframe-isolated mlightcad).
           Always rendered when a DWG URL exists so the iframe starts
           loading while the user is on the PDF tab. Hidden via
           absolute positioning (not display:none) because browsers
           defer loading iframes that are display:none. -->
      <div
        v-if="hasDwg"
        class="flex flex-1 flex-col overflow-hidden bg-surface-gray-1"
        :class="activeFile !== 'dwg' ? 'absolute inset-0 opacity-0 pointer-events-none -z-10' : 'relative'"
      >
        <div class="flex items-center justify-between border-b border-surface-gray-3 bg-surface-white px-3 py-1.5">
          <span class="truncate max-w-xs text-xs text-ink-gray-6">{{ fileName(dwgUrl) }}</span>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              @click="toggleDwgFullscreen"
              class="flex items-center gap-1 rounded px-2 py-1 min-h-[44px] md:min-h-0 text-xs font-medium text-ink-gray-6 hover:bg-surface-gray-2"
              :title="dwgIsFullscreen ? 'Exit full screen' : 'Full screen'"
            >
              <Maximize2 v-if="!dwgIsFullscreen" class="size-3" />
              <Minimize2 v-else class="size-3" />
              <span class="hidden sm:inline">{{ dwgIsFullscreen ? 'Exit' : 'Full screen' }}</span>
            </button>
            <a :href="dwgUrl" download
              class="flex items-center gap-1 rounded px-2 py-1 min-h-[44px] md:min-h-0 text-xs font-medium text-ink-gray-6 hover:bg-surface-gray-2">
              <Download class="size-3" /> <span class="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
        <div ref="dwgWrapperRef" class="flex-1 overflow-hidden bg-surface-gray-1">
          <iframe
            v-if="dwgViewerSrc"
            ref="dwgIframeRef"
            :src="dwgViewerSrc"
            class="h-full w-full border-0"
            allowfullscreen
            :title="fileName(dwgUrl)"
          />
        </div>
      </div>

      <!-- E2K File card -->
      <div v-if="hasE2k && activeFile === 'e2k'" class="flex flex-1 items-center justify-center bg-surface-gray-1 p-6">
        <div class="w-full max-w-sm">
          <div class="rounded-xl border border-surface-gray-3 bg-surface-white overflow-hidden shadow-sm">
            <div class="flex items-center gap-3 bg-purple-50 px-5 py-4 border-b border-purple-100">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 shadow-sm flex-shrink-0">
                <Cpu class="size-6 text-white" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-ink-gray-9 truncate">{{ fileName(e2kUrl) }}</p>
                <p class="text-xs text-purple-600 font-medium">ETABS E2K Structural Model</p>
              </div>
            </div>
            <div class="px-5 py-4 flex flex-col gap-3">
              <div class="flex items-start gap-2 rounded-lg bg-surface-gray-1 px-3 py-2.5">
                <Info class="size-4 text-ink-gray-4 mt-0.5 flex-shrink-0" />
                <p class="text-xs text-ink-gray-6 leading-relaxed">E2K files are ETABS structural analysis models. Open with ETABS or CSi products for analysis.</p>
              </div>
              <a :href="e2kUrl" download
                class="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
                <Download class="size-4" /> Download E2K File
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!hasPdf && !hasDwg && !hasE2k" class="flex flex-1 flex-col items-center justify-center bg-surface-gray-1 p-6 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-gray-2">
          <FileX class="size-8 text-ink-gray-4" />
        </div>
        <p class="text-sm font-medium text-ink-gray-7">No files uploaded yet</p>
        <p class="mt-1 text-xs text-ink-gray-4">Upload files using the panel on the right</p>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  FileText,
  Box,
  Download,
  Maximize2,
  Info,
  FileX,
  Image,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Minimize2,
} from 'lucide-vue-next'
import { useTheme } from '../../../composables/useTheme.js'

defineOptions({ name: 'EuiFileViewer' })

const { theme: appTheme } = useTheme()

// AcEdOpenMode enum values: Read=0, Review=4, Write=8
const CAD_MODE_READ = 0
const CAD_MODE_WRITE = 8

const props = defineProps({
  pdfUrl:      { type: String, default: null },
  dwgUrl:      { type: String, default: null },
  e2kUrl:      { type: String, default: null },
  images:      { type: Array,  default: () => [] },  // for 3D renders
  drawingType: { type: String, default: '' },
  // True when the consumer wants the embedded DWG viewer to open in
  // write mode (Pro tier). Replaces the previous direct read of the
  // session store so this component stays presentational.
  canEdit:     { type: Boolean, default: false },
  // URL to the DWG viewer iframe entry point. Each consuming app ships
  // its own copy of `dwg-viewer/index.html` under its assets, so the
  // base path is provided by the consumer.
  // Default targets enirman_connect's bundled viewer.
  dwgViewerSrcBase: { type: String, default: '/assets/enirman_connect/dwg-viewer/index.html' },
})

const is3D    = computed(() => props.drawingType === '3D Render')
const hasPdf  = computed(() => !!props.pdfUrl)
const hasDwg  = computed(() => !!props.dwgUrl)
const hasE2k  = computed(() => !!props.e2kUrl)

// Non-null images for 3D gallery
const activeImages = computed(() => (props.images || []).filter(Boolean))

// Active image index for gallery
const activeImageIdx = ref(0)
watch(() => props.images, () => { activeImageIdx.value = 0 })

// Active file tab for arch/structural
const activeFile = ref(props.pdfUrl ? 'pdf' : (props.dwgUrl ? 'dwg' : (props.e2kUrl ? 'e2k' : 'pdf')))

watch(() => props.pdfUrl, (v) => { if (v) activeFile.value = 'pdf' })
watch(() => props.dwgUrl, (v) => { if (v && !props.pdfUrl) activeFile.value = 'dwg' })
watch(() => props.e2kUrl, (v) => { if (v && !props.pdfUrl && !props.dwgUrl) activeFile.value = 'e2k' })

function fileName(url) {
  if (!url) return ''
  return decodeURIComponent(url.split('/').pop().split('?')[0])
}

const absoluteDwgUrl = computed(() => {
  if (!props.dwgUrl) return ''
  return props.dwgUrl.startsWith('http')
    ? props.dwgUrl
    : `${window.location.origin}${props.dwgUrl}`
})

const cadViewerMode = computed(() =>
  props.canEdit ? CAD_MODE_WRITE : CAD_MODE_READ,
)

const dwgIframeRef = ref(null)

const dwgViewerSrc = computed(() => {
  if (!props.dwgUrl) return ''
  const params = new URLSearchParams({
    url: props.dwgUrl,
    mode: String(cadViewerMode.value),
    // Follow the parent app theme — iframe reloads on toggle. The
    // mlightcad library re-parses the drawing on theme change either
    // way, so reload-on-switch has no worse perf than prop update.
    theme: appTheme.value === 'dark' ? 'dark' : 'light',
  })
  return `${props.dwgViewerSrcBase}?${params}`
})

const dwgWrapperRef = ref(null)
const dwgIsFullscreen = ref(false)

function toggleDwgFullscreen() {
  const el = dwgWrapperRef.value
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', () => {
    dwgIsFullscreen.value = document.fullscreenElement === dwgWrapperRef.value
  })
}
</script>
