<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'EuiDrawingCanvas' })

const props = defineProps({ src: { type: String, default: '' } })

const zoom = ref(1)
const pan = ref({ x: 0, y: 0 })
const dragging = ref(false)
let dragStart = null

function onWheel(e) {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.1 : 0.9
  zoom.value = Math.max(0.25, Math.min(5, zoom.value * factor))
}
function onDown(e) {
  dragging.value = true
  dragStart = { x: e.clientX - pan.value.x, y: e.clientY - pan.value.y }
}
function onMove(e) {
  if (!dragging.value) return
  pan.value = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }
}
function onUp() { dragging.value = false }

const transform = computed(() => `translate(${pan.value.x}px, ${pan.value.y}px) scale(${zoom.value})`)
const isPdf = computed(() => (props.src || '').toLowerCase().endsWith('.pdf'))

defineExpose({ zoom, pan })
</script>

<template>
  <div
    class="relative w-full h-full overflow-hidden bg-muted/20 select-none"
    @wheel="onWheel" @mousedown="onDown" @mousemove="onMove" @mouseup="onUp" @mouseleave="onUp"
  >
    <div class="absolute top-1/2 left-1/2 origin-center" :style="{ transform }">
      <embed v-if="isPdf" :src="src" type="application/pdf" class="w-[840px] h-[1188px] bg-white" />
      <img v-else-if="src" :src="src" class="max-w-[1200px] bg-white" />
      <slot />
    </div>
  </div>
</template>
