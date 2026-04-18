<template>
  <div class="eui-search" :class="[`eui-search--${size}`]">
    <svg class="eui-search__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11 L14 14" stroke-linecap="round" />
    </svg>
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      type="search"
      class="eui-search__input"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="modelValue"
      type="button"
      class="eui-search__clear"
      aria-label="Clear"
      @click="$emit('update:modelValue', '')"
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke-linecap="round" />
      </svg>
    </button>
    <span v-if="shortcut && !modelValue" class="eui-search__shortcut">{{ shortcut }}</span>
  </div>
</template>

<script setup>
/*
 * EuiSearchInput — search field with icon, clear button, and optional shortcut hint.
 *
 * Props: modelValue, placeholder, size (sm|md), disabled, shortcut (e.g. 'Ctrl K')
 */
defineProps({
  modelValue:  { type: String, default: '' },
  placeholder: { type: String, default: 'Search…' },
  size:        { type: String, default: 'md' },
  disabled:    { type: Boolean, default: false },
  shortcut:    { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.eui-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.eui-search__icon {
  position: absolute;
  left: 10px;
  width: 15px; height: 15px;
  color: var(--ink-gray-5);
  pointer-events: none;
}
.eui-search__input {
  width: 100%;
  background: var(--surface-gray-1);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding: 0 34px 0 32px;
  color: var(--ink-gray-9);
  font-size: 14px;
  transition: background-color .12s, border-color .12s, box-shadow .12s;
  outline: none;
}
.eui-search__input::placeholder { color: var(--ink-gray-4); }
.eui-search__input:hover:not(:focus) { background: var(--surface-gray-2); }
.eui-search__input:focus {
  background: var(--surface-white);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
}
.eui-search--sm .eui-search__input { height: 30px; font-size: 13px; }
.eui-search--md .eui-search__input { height: 34px; }

.eui-search__clear {
  position: absolute;
  right: 8px;
  width: 20px; height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-gray-5);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-xs);
}
.eui-search__clear:hover { background: var(--surface-gray-2); color: var(--ink-gray-8); }
.eui-search__clear svg { width: 12px; height: 12px; }

.eui-search__shortcut {
  position: absolute;
  right: 8px;
  padding: 1px 6px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--ink-gray-5);
  background: var(--surface-gray-2);
  border-radius: var(--radius-sm);
  pointer-events: none;
}
</style>
