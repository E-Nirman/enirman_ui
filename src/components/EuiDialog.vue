<template>
  <Teleport to="body">
    <Transition name="eui-dialog">
      <div v-if="modelValue" class="eui-dialog__backdrop" @click.self="onBackdropClick" role="presentation">
        <div
          class="eui-dialog"
          :class="[`eui-dialog--${size}`, { 'eui-dialog--flush': flush }]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <header v-if="title || $slots.header || dismissible" class="eui-dialog__header">
            <div class="eui-dialog__title-wrap">
              <component v-if="icon" :is="icon" class="eui-dialog__icon" aria-hidden="true" />
              <h2 v-if="title" :id="titleId" class="eui-dialog__title">{{ title }}</h2>
              <slot v-else name="header" />
            </div>
            <button
              v-if="dismissible"
              class="eui-dialog__close"
              type="button"
              aria-label="Close"
              @click="close"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4" aria-hidden="true">
                <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke-linecap="round" />
              </svg>
            </button>
          </header>
          <div class="eui-dialog__body" :class="{ 'eui-dialog__body--flush': flush }">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="eui-dialog__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'

/*
 * EuiDialog — modal overlay.
 *
 * Sizes: sm (420), md (560, default), lg (720), xl (960), full
 *
 * - Closes on backdrop click unless `:persistent="true"`
 * - Closes on Escape key
 * - Locks body scroll while open
 * - Use #header / #footer slots for custom chrome; pass `title` for standard
 */

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title:      { type: String, default: '' },
  icon:       { type: [Object, Function], default: null },
  size:       { type: String, default: 'md' },
  persistent: { type: Boolean, default: false },
  dismissible:{ type: Boolean, default: true },
  flush:      { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'close'])

const titleId = computed(() => `eui-dialog-title-${Math.random().toString(36).slice(2, 9)}`)

function close() {
  emit('update:modelValue', false)
  emit('close')
}
function onBackdropClick() {
  if (!props.persistent) close()
}
function onKey(e) {
  if (e.key === 'Escape' && props.modelValue && !props.persistent) close()
}

watch(() => props.modelValue, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => { if (typeof window !== 'undefined') window.addEventListener('keydown', onKey) })
onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<style scoped>
.eui-dialog__backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.45);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.eui-dialog {
  background: var(--surface-white);
  border: 1px solid var(--surface-gray-3);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 32px);
  overflow: hidden;
}
[data-theme="dark"] .eui-dialog { background: var(--surface-modal); }

.eui-dialog--sm  { max-width: 420px; }
.eui-dialog--md  { max-width: 560px; }
.eui-dialog--lg  { max-width: 720px; }
.eui-dialog--xl  { max-width: 960px; }
.eui-dialog--full { max-width: none; width: 100%; height: 100%; max-height: none; border-radius: 0; }

.eui-dialog__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--surface-gray-2);
}
.eui-dialog__title-wrap { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; }
.eui-dialog__icon { width: 18px; height: 18px; color: var(--ink-gray-6); flex-shrink: 0; }
.eui-dialog__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ink-gray-9);
  line-height: 1.3;
}
.eui-dialog__close {
  width: 28px; height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--ink-gray-5);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color .15s, color .15s;
}
.eui-dialog__close:hover { background: var(--surface-gray-2); color: var(--ink-gray-8); }

.eui-dialog__body { padding: 20px; overflow-y: auto; }
.eui-dialog__body--flush { padding: 0; }
.eui-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--surface-gray-2);
  background: var(--surface-gray-1);
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .eui-dialog__backdrop { padding: 0; align-items: flex-end; }
  .eui-dialog { border-radius: var(--radius-2xl) var(--radius-2xl) 0 0; max-height: 92vh; }
  .eui-dialog--full { border-radius: 0; height: 100%; max-height: none; }
}

/* Transitions */
.eui-dialog-enter-active, .eui-dialog-leave-active { transition: opacity .2s; }
.eui-dialog-enter-active .eui-dialog, .eui-dialog-leave-active .eui-dialog { transition: transform .25s cubic-bezier(.4,0,.2,1), opacity .2s; }
.eui-dialog-enter-from, .eui-dialog-leave-to { opacity: 0; }
.eui-dialog-enter-from .eui-dialog, .eui-dialog-leave-to .eui-dialog { transform: translateY(12px) scale(.98); opacity: 0; }
</style>
