<template>
  <header class="eui-page-header" :class="{ 'eui-page-header--bordered': bordered }">
    <div class="eui-page-header__main">
      <nav v-if="breadcrumbs && breadcrumbs.length" class="eui-page-header__crumbs" aria-label="Breadcrumb">
        <template v-for="(c, i) in breadcrumbs" :key="i">
          <component :is="c.to ? 'router-link' : 'span'" :to="c.to" class="eui-page-header__crumb">{{ c.label }}</component>
          <svg v-if="i < breadcrumbs.length - 1" class="eui-page-header__crumb-sep" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 3 L11 8 L6 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </template>
      </nav>
      <div class="eui-page-header__row">
        <div class="eui-page-header__title-wrap">
          <component v-if="icon" :is="icon" class="eui-page-header__icon" aria-hidden="true" />
          <h1 class="eui-page-header__title">{{ title }}</h1>
          <slot name="title-badge" />
        </div>
        <div v-if="$slots.actions" class="eui-page-header__actions">
          <slot name="actions" />
        </div>
      </div>
      <p v-if="subtitle || $slots.subtitle" class="eui-page-header__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <div v-if="$slots.extra" class="eui-page-header__extra">
      <slot name="extra" />
    </div>
  </header>
</template>

<script setup>
/*
 * EuiPageHeader — canonical page title row.
 *
 * Every top-level page starts with this. Handles title + subtitle + breadcrumbs
 * + action buttons (right side) + optional #extra slot below for filters/tabs.
 */
defineProps({
  title:       { type: String, required: true },
  subtitle:    { type: String, default: '' },
  icon:        { type: [Object, Function], default: null },
  breadcrumbs: { type: Array, default: () => [] },
  bordered:    { type: Boolean, default: true },
})
</script>

<style scoped>
.eui-page-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 24px 14px;
  background: var(--surface-white);
}
.eui-page-header--bordered { border-bottom: 1px solid var(--surface-gray-2); }

.eui-page-header__main { display: flex; flex-direction: column; gap: 4px; }

.eui-page-header__crumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ink-gray-5);
}
.eui-page-header__crumb { color: inherit; text-decoration: none; }
.eui-page-header__crumb:last-child { color: var(--ink-gray-7); font-weight: 500; }
a.eui-page-header__crumb:hover { color: var(--color-primary-ink); }
.eui-page-header__crumb-sep { width: 10px; height: 10px; color: var(--ink-gray-3); }

.eui-page-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.eui-page-header__title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.eui-page-header__icon {
  width: 22px; height: 22px;
  color: var(--ink-gray-6);
  flex-shrink: 0;
}
.eui-page-header__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-gray-9);
  line-height: 1.2;
  word-break: break-word;
  min-width: 0;
}
.eui-page-header__subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--ink-gray-5);
  max-width: 760px;
}
.eui-page-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  row-gap: 8px;
}
.eui-page-header__actions > * { flex-shrink: 0; }
.eui-page-header__extra { margin-top: 6px; }

@media (max-width: 640px) {
  .eui-page-header { padding: 14px 16px 12px; }
  .eui-page-header__title { font-size: 19px; }
  .eui-page-header__row { flex-direction: column; align-items: flex-start; }
  .eui-page-header__actions { width: 100%; }
}
</style>
