<template>
  <div class="eui-tabs" :class="[`eui-tabs--${variant}`, { 'eui-tabs--full': full }]" role="tablist" :aria-orientation="'horizontal'">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :disabled="tab.disabled"
      class="eui-tabs__item"
      :class="{ 'eui-tabs__item--active': modelValue === tab.value }"
      @click="select(tab)"
    >
      <component v-if="tab.icon" :is="tab.icon" class="eui-tabs__icon" aria-hidden="true" />
      <span>{{ tab.label }}</span>
      <span v-if="tab.count !== undefined && tab.count !== null" class="eui-tabs__count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<script setup>
/*
 * EuiTabs — horizontal navigation tabs.
 *
 * Variants:
 *   underline (default) — active state is a bottom border + filled ink color
 *   pills               — active state is a filled pill background
 *   segmented           — joined segmented control (compact)
 *
 * tabs prop shape: [{ label, value, icon?, count?, disabled? }]
 */
defineProps({
  modelValue: { type: [String, Number], default: null },
  tabs:       { type: Array, required: true },
  variant:    { type: String, default: 'underline' },
  full:       { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'change'])

function select(tab) {
  if (tab.disabled) return
  emit('update:modelValue', tab.value)
  emit('change', tab.value)
}
</script>

<style scoped>
.eui-tabs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}
.eui-tabs::-webkit-scrollbar { display: none; }
.eui-tabs--full { display: flex; width: 100%; }

.eui-tabs__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-gray-6);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: color .15s, background-color .15s, border-color .15s;
  white-space: nowrap;
}
.eui-tabs__item:disabled { opacity: .4; cursor: not-allowed; }
.eui-tabs__icon { width: 15px; height: 15px; }
.eui-tabs__count {
  min-width: 18px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  background: var(--surface-gray-2);
  color: var(--ink-gray-6);
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

/* Underline */
.eui-tabs--underline {
  gap: 0;
  border-bottom: 1px solid var(--surface-gray-2);
}
.eui-tabs--underline .eui-tabs__item {
  border-radius: 0;
  padding: 10px 14px;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.eui-tabs--underline .eui-tabs__item:hover:not(:disabled) { color: var(--ink-gray-8); }
.eui-tabs--underline .eui-tabs__item--active {
  color: var(--color-primary-ink);
  border-bottom-color: var(--color-primary);
}
.eui-tabs--underline .eui-tabs__item--active .eui-tabs__count {
  background: var(--color-primary-subtle);
  color: var(--color-primary-ink);
}

/* Pills */
.eui-tabs--pills { padding: 2px; background: var(--surface-gray-1); border-radius: var(--radius-lg); gap: 2px; }
.eui-tabs--pills .eui-tabs__item { padding: 6px 12px; }
.eui-tabs--pills .eui-tabs__item:hover:not(:disabled) { color: var(--ink-gray-8); background: var(--surface-gray-2); }
.eui-tabs--pills .eui-tabs__item--active {
  background: var(--surface-white);
  color: var(--ink-gray-9);
  box-shadow: var(--shadow-xs);
}
[data-theme="dark"] .eui-tabs--pills .eui-tabs__item--active { background: var(--surface-gray-3); }

/* Segmented */
.eui-tabs--segmented {
  border: 1px solid var(--surface-gray-3);
  border-radius: var(--radius-md);
  overflow: hidden;
  gap: 0;
}
.eui-tabs--segmented .eui-tabs__item { border-radius: 0; padding: 6px 12px; border-right: 1px solid var(--surface-gray-3); }
.eui-tabs--segmented .eui-tabs__item:last-child { border-right: none; }
.eui-tabs--segmented .eui-tabs__item--active { background: var(--surface-gray-2); color: var(--ink-gray-9); }

.eui-tabs--full .eui-tabs__item { flex: 1; justify-content: center; }
</style>
