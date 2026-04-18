<template>
  <div class="eui-empty" :class="[`eui-empty--${tone}`, { 'eui-empty--bordered': bordered, 'eui-empty--compact': compact }]">
    <div v-if="icon" class="eui-empty__icon-wrap">
      <component :is="icon" class="eui-empty__icon" aria-hidden="true" />
    </div>
    <h3 v-if="title" class="eui-empty__title">{{ title }}</h3>
    <p v-if="description" class="eui-empty__description">{{ description }}</p>
    <div v-if="$slots.action" class="eui-empty__actions">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
/*
 * EuiEmptyState — placeholder for no-data, no-results, or blank-slate views.
 *
 * Tones: gray (default), brand, success, warning, danger, accent
 * `bordered` wraps it in a dashed card; `compact` reduces vertical padding.
 */
defineProps({
  icon:        { type: [Object, Function], default: null },
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
  tone:        { type: String, default: 'gray' },
  bordered:    { type: Boolean, default: false },
  compact:     { type: Boolean, default: false },
})
</script>

<style scoped>
.eui-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  gap: 8px;
}
.eui-empty--compact { padding: 28px 20px; }
.eui-empty--bordered {
  border: 1px dashed var(--surface-gray-3);
  border-radius: var(--radius-xl);
  background: var(--surface-gray-1);
}
.eui-empty__icon-wrap {
  width: 44px; height: 44px;
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}
.eui-empty__icon { width: 22px; height: 22px; }

.eui-empty--gray    .eui-empty__icon-wrap { background: var(--surface-gray-2); color: var(--ink-gray-5); }
.eui-empty--brand   .eui-empty__icon-wrap { background: var(--color-primary-subtle); color: var(--color-primary-ink); }
.eui-empty--success .eui-empty__icon-wrap { background: var(--color-success-subtle); color: var(--color-success-ink); }
.eui-empty--warning .eui-empty__icon-wrap { background: var(--color-warning-subtle); color: var(--color-warning-ink); }
.eui-empty--danger  .eui-empty__icon-wrap { background: var(--color-danger-subtle); color: var(--color-danger-ink); }
.eui-empty--accent  .eui-empty__icon-wrap { background: var(--color-accent-subtle); color: var(--color-accent-ink); }

.eui-empty__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-gray-8);
  margin: 0;
}
.eui-empty__description {
  font-size: 13px;
  color: var(--ink-gray-5);
  margin: 0;
  max-width: 360px;
  line-height: 1.5;
}
.eui-empty__actions {
  display: inline-flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
