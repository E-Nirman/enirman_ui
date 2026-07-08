<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import EuiStatusFlow from '../EuiStatusFlow/EuiStatusFlow.vue'
import EuiVersionTimeline from '../EuiVersionTimeline/EuiVersionTimeline.vue'
import EuiReviewCard from '../EuiReviewCard/EuiReviewCard.vue'

defineOptions({ name: 'EuiDesignItemPane' })

/*
 * EuiDesignItemPane (v3) — tabbed workflow panel (Workflow / Versions /
 * Reviews / History). The Workflow tab is a stack of grouped clusters,
 * each with a 10px uppercase heading over a top hairline:
 *
 *   STAGE        vertical EuiStatusFlow (steps prop)
 *   VERSION      option segmented control + mono version + category tag +
 *                one-line revision context + "View N older versions →"
 *   SHARED WITH  avatar + name + access scope + ghost Manage button
 *   NEXT ACTION  exactly one primary button, decision actions as bordered
 *                tone cards; destructive ops hidden behind a disclosure
 *
 * Resizable (drag the left-edge handle, clamp 300–560px) and collapsible
 * (» → a 36px vertical strip, « to reopen). Width + open state persist
 * to localStorage under `storageKey`.
 */

const props = defineProps({
  item:          { type: Object,  default: null },
  steps:         { type: Array,   default: () => [] },   // STAGE — EuiStatusFlow
  versions:      { type: Array,   default: () => [] },   // Versions tab
  reviews:       { type: Array,   default: () => [] },   // Reviews tab
  notes:         { type: Array,   default: () => [] },   // Reviews tab — internal notes
  history:       { type: Array,   default: () => [] },   // History tab — [{ time, text }]
  options:       { type: Array,   default: () => [] },   // segmented control labels
  activeOption:  { type: String,  default: '' },
  sharedWith:    { type: Array,   default: () => [] },   // [{ name, initials, role, access }]
  decisionActions:    { type: Array, default: () => [] }, // [{ key, label, description, tone }]
  destructiveActions: { type: Array, default: () => [] }, // [{ key, label, description }]
  primaryAction: { type: Object,  default: null },       // { key, label, description } — overrides switch
  storageKey:    { type: String,  default: 'eui-design-pane' },
  defaultWidth:  { type: Number,  default: 372 },
  minWidth:      { type: Number,  default: 300 },
  maxWidth:      { type: Number,  default: 560 },
})

const emit = defineEmits([
  'close', 'open-detail', 'tab-change',
  'primary', 'decision', 'destructive',
  'select-option', 'view-older', 'select-version', 'manage-sharing',
])

/* ---------------------------------------------------------------- tabs */
const TABS = [
  { key: 'workflow', label: 'Workflow' },
  { key: 'versions', label: 'Versions' },
  { key: 'reviews',  label: 'Reviews' },
  { key: 'history',  label: 'History' },
]
const tab = ref('workflow')
const setTab = (t) => { tab.value = t; emit('tab-change', t) }

/* ------------------------------------------------- next-action primary */
const primaryLabel = computed(() => {
  if (props.primaryAction?.label) return props.primaryAction.label
  switch (props.item?.status) {
    case 'Working':          return 'Forward to Internal Review'
    case 'Internal Review':  return 'Forward to Client'
    case 'Sent to Client':   return 'Mark Client Approved'
    case 'Client Approved':  return 'Forward to Municipality'
    case 'Needs Redesign':
    case 'Needs Correction':
    case 'Municipality Change Requested': return 'Upload new version'
    default: return 'Forward'
  }
})

const DECISION_TONE = {
  destructive: 'border-destructive-muted hover:bg-destructive-muted',
  warning:     'border-warning-muted hover:bg-warning-muted',
  neutral:     'border-border-subtle hover:bg-muted',
}
const DECISION_INK = {
  destructive: 'text-destructive-ink',
  warning:     'text-warning-ink',
  neutral:     'text-foreground',
}

const showDanger = ref(false)

/* ------------------------------------------- version cluster shortcuts */
const category = computed(() => props.item?.category || props.item?.revision_type || '')
const revisionContext = computed(() => props.item?.revision_context || props.item?.description || '')
const olderCount = computed(() => props.item?.older_versions_count || 0)
const olderLabel = computed(() =>
  olderCount.value > 0 ? `View ${olderCount.value} older versions →` : 'No older versions yet')

/* --------------------------------------------- resize + collapse state */
const clamp = (n) => Math.min(props.maxWidth, Math.max(props.minWidth, n))
const panelW = ref(props.defaultWidth)
const collapsed = ref(false)

let dragging = false
let startX = 0
let startW = 0
const onMove = (e) => {
  if (!dragging) return
  // handle is on the pane's LEFT edge → dragging left widens it
  panelW.value = clamp(startW + (startX - e.clientX))
}
const onUp = () => {
  if (!dragging) return
  dragging = false
  if (typeof document !== 'undefined') document.body.style.userSelect = ''
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
  persist()
}
const startResize = (e) => {
  dragging = true
  startX = e.clientX
  startW = panelW.value
  if (typeof document !== 'undefined') document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  e.preventDefault()
}

const persist = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`${props.storageKey}:w`, String(panelW.value))
    window.localStorage.setItem(`${props.storageKey}:c`, collapsed.value ? '1' : '0')
  } catch { /* storage may be unavailable */ }
}
watch(collapsed, persist)

onMounted(() => {
  if (typeof window === 'undefined') return
  try {
    const w = Number(window.localStorage.getItem(`${props.storageKey}:w`))
    if (w) panelW.value = clamp(w)
    collapsed.value = window.localStorage.getItem(`${props.storageKey}:c`) === '1'
  } catch { /* ignore */ }
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
})
</script>

<template>
  <div v-if="item" class="flex h-full items-stretch">
    <!-- collapsed strip -->
    <button
      v-if="collapsed"
      type="button"
      class="flex w-9 flex-none cursor-pointer flex-col items-center gap-3 rounded-[10px] border border-border-subtle bg-card py-3 text-muted-foreground hover:border-border-strong hover:bg-muted"
      title="Expand panel"
      @click="collapsed = false"
    >
      <span class="text-sm font-semibold">«</span>
      <span class="text-[10px] font-semibold uppercase tracking-wider [writing-mode:vertical-rl]">Workflow panel</span>
    </button>

    <!-- expanded: drag handle + panel -->
    <template v-else>
      <div
        class="flex w-2.5 flex-none cursor-col-resize select-none items-center justify-center"
        title="Drag to resize"
        @mousedown="startResize"
      >
        <span class="h-12 w-[3px] rounded-full bg-border-strong" />
      </div>

      <div
        class="flex flex-none flex-col overflow-hidden rounded-xl border border-border-subtle bg-card"
        :style="{ width: panelW + 'px' }"
      >
        <!-- tab row -->
        <div class="flex flex-none items-center border-b border-border-subtle px-2">
          <button
            v-for="t in TABS"
            :key="t.key"
            type="button"
            class="h-10 border-b-2 px-3 text-xs font-semibold transition-colors"
            :class="tab === t.key
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'"
            @click="setTab(t.key)"
          >{{ t.label }}</button>
          <button
            type="button"
            class="ml-auto grid h-[26px] w-[26px] place-items-center rounded-md text-[13px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Collapse panel"
            @click="collapsed = true"
          >»</button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <!-- ========================================= WORKFLOW TAB -->
          <template v-if="tab === 'workflow'">
            <!-- STAGE -->
            <div class="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Stage</div>
            <div class="mb-4">
              <EuiStatusFlow v-if="steps.length" :steps="steps" />
              <div v-else class="text-xs text-muted-foreground/70">No stage data.</div>
            </div>

            <!-- VERSION -->
            <div class="mt-4 border-t border-border-subtle pt-3.5">
              <div class="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Version</div>
              <div class="mb-2 flex flex-wrap items-center gap-2.5">
                <div v-if="options.length" class="inline-flex rounded-md border border-border-subtle bg-muted/40 p-0.5">
                  <button
                    v-for="opt in options"
                    :key="opt"
                    type="button"
                    class="rounded px-2.5 py-1 text-2xs font-semibold transition-colors"
                    :class="opt === activeOption
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'"
                    @click="emit('select-option', opt)"
                  >{{ opt }}</button>
                </div>
                <span class="font-mono text-sm font-semibold text-foreground">{{ item.version_label }}</span>
                <span v-if="category"
                      class="rounded-[4px] bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{{ category }}</span>
              </div>
              <div v-if="revisionContext" class="mb-2 text-xs font-medium text-muted-foreground">{{ revisionContext }}</div>
              <button type="button" class="text-xs font-medium text-info-ink hover:underline"
                      @click="olderCount > 0 && emit('view-older')">{{ olderLabel }}</button>
            </div>

            <!-- SHARED WITH -->
            <div class="mt-4 border-t border-border-subtle pt-3.5">
              <div class="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Shared with</div>
              <div v-for="p in sharedWith" :key="p.name" class="flex items-center gap-2.5 py-1">
                <span class="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-info text-[10px] font-bold text-info-foreground">{{ p.initials }}</span>
                <div class="min-w-0 flex-1">
                  <div class="text-xs font-semibold text-foreground">{{ p.name }}</div>
                  <div class="text-2xs font-medium text-muted-foreground">{{ [p.role, p.access].filter(Boolean).join(' · ') }}</div>
                </div>
                <button type="button"
                        class="rounded-md border border-border-subtle px-2.5 py-1 text-2xs font-semibold text-muted-foreground hover:bg-muted"
                        @click="emit('manage-sharing', p)">Manage</button>
              </div>
              <div v-if="!sharedWith.length" class="text-xs font-medium text-muted-foreground/70">Not shared yet.</div>
            </div>

            <!-- NEXT ACTION -->
            <div class="mt-4 border-t border-border-subtle pt-3.5">
              <div class="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Next action</div>
              <button
                type="button"
                class="flex w-full flex-col items-center justify-center gap-0.5 rounded-md bg-primary px-3 py-2 text-primary-foreground"
                @click="emit('primary', primaryAction?.key)"
              >
                <span class="text-xs font-semibold">{{ primaryLabel }}</span>
                <span v-if="primaryAction?.description" class="text-[11px] font-normal opacity-85">{{ primaryAction.description }}</span>
              </button>

              <div v-if="decisionActions.length" class="mt-2 flex flex-col gap-2">
                <button
                  v-for="d in decisionActions"
                  :key="d.key"
                  type="button"
                  class="rounded-lg border px-3 py-2.5 text-left transition-colors"
                  :class="DECISION_TONE[d.tone] || DECISION_TONE.neutral"
                  @click="emit('decision', d.key)"
                >
                  <div class="text-xs font-semibold" :class="DECISION_INK[d.tone] || DECISION_INK.neutral">{{ d.label }}</div>
                  <div v-if="d.description" class="mt-0.5 text-[11px] text-muted-foreground">{{ d.description }}</div>
                </button>
              </div>

              <template v-if="destructiveActions.length">
                <button
                  type="button"
                  class="mt-3.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive-ink"
                  @click="showDanger = !showDanger"
                >
                  <span class="text-[10px]">{{ showDanger ? '▾' : '▸' }}</span> Destructive actions
                </button>
                <div v-if="showDanger" class="mt-2 flex flex-col gap-2">
                  <button
                    v-for="a in destructiveActions"
                    :key="a.key"
                    type="button"
                    class="rounded-lg border border-destructive-muted px-3 py-2.5 text-left hover:bg-destructive-muted"
                    @click="emit('destructive', a.key)"
                  >
                    <div class="text-xs font-semibold text-destructive-ink">{{ a.label }}</div>
                    <div v-if="a.description" class="mt-0.5 text-[11px] text-muted-foreground">{{ a.description }}</div>
                  </button>
                </div>
              </template>
            </div>
          </template>

          <!-- ========================================= VERSIONS TAB -->
          <template v-else-if="tab === 'versions'">
            <EuiVersionTimeline v-if="versions.length" :versions="versions" @select="emit('select-version', $event)" />
            <div v-else class="text-xs text-muted-foreground/70">No versions yet.</div>
          </template>

          <!-- ========================================== REVIEWS TAB -->
          <template v-else-if="tab === 'reviews'">
            <div class="space-y-2.5">
              <EuiReviewCard v-for="(r, i) in reviews" :key="r.name || i" :review="r" />
            </div>
            <div v-if="!reviews.length" class="text-xs text-muted-foreground/70">No reviews yet.</div>

            <template v-if="notes.length">
              <div class="mb-2.5 mt-4 border-t border-border-subtle pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Internal notes</div>
              <div v-for="(n, i) in notes" :key="n.name || i" class="flex gap-2.5 border-b border-border-subtle py-2 last:border-b-0">
                <span class="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-muted text-[9px] font-bold text-foreground">{{ n.initials }}</span>
                <div class="min-w-0 flex-1 text-xs text-muted-foreground">
                  <strong class="font-semibold text-foreground">{{ n.name }}</strong><span v-if="n.note_type"> · {{ n.note_type }}</span>
                  <div v-if="n.quote" class="mt-0.5">“{{ n.quote }}”</div>
                </div>
                <span v-if="n.version" class="text-2xs font-medium text-muted-foreground/70">{{ n.version }}</span>
              </div>
            </template>
          </template>

          <!-- ========================================== HISTORY TAB -->
          <template v-else-if="tab === 'history'">
            <div v-for="(h, i) in history" :key="i" class="flex gap-2.5 border-b border-border-subtle py-2 text-xs text-muted-foreground last:border-b-0">
              <span class="w-[92px] flex-none font-mono text-[11px] font-medium text-muted-foreground/70">{{ h.time }}</span>
              <span class="min-w-0 flex-1">{{ h.text }}</span>
            </div>
            <div v-if="!history.length" class="text-xs text-muted-foreground/70">No history yet.</div>
          </template>
        </div>

        <!-- footer: open full detail -->
        <div class="flex-none border-t border-border-subtle bg-card px-4 py-2.5">
          <button type="button"
                  class="w-full rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                  @click="emit('open-detail')">Open full detail page →</button>
        </div>
      </div>
    </template>
  </div>
</template>
