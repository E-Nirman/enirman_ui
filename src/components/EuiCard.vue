<template>
  <component :is="tag" class="eui-card" :class="[{ 'eui-card--interactive': interactive || to || href, 'eui-card--flush': flush, 'eui-card--raised': raised }]" :to="to" :href="href">
    <header v-if="$slots.header || title" class="eui-card__header">
      <div v-if="$slots.header" class="eui-card__header-slot"><slot name="header" /></div>
      <template v-else>
        <component v-if="icon" :is="icon" class="eui-card__icon" aria-hidden="true" />
        <h3 class="eui-card__title">{{ title }}</h3>
        <span v-if="badge" class="eui-card__badge">{{ badge }}</span>
        <div class="eui-card__actions"><slot name="actions" /></div>
      </template>
    </header>
    <div class="eui-card__body" :class="{ 'eui-card__body--flush': flush }"><slot /></div>
    <footer v-if="$slots.footer" class="eui-card__footer"><slot name="footer" /></footer>
  </component>
</template>

<script setup>
import { computed } from 'vue'

/*
 * EuiCard — a bordered, rounded surface.
 *
 * Patterns:
 *   <EuiCard title="…" :icon="X">…</EuiCard>
 *   <EuiCard><template #header>…</template>…</EuiCard>
 *   <EuiCard :to="…" interactive>  // clickable card
 *   <EuiCard flush>  // no body padding (for tables/lists)
 *   <EuiCard raised> // adds shadow-sm (for floating cards)
 */

const props = defineProps({
  title:    { type: String, default: '' },
  badge:    { type: String, default: '' },
  icon:     { type: [Object, Function], default: null },
  to:       { type: [String, Object], default: null },
  href:     { type: String, default: null },
  interactive: { type: Boolean, default: false },
  flush:    { type: Boolean, default: false },
  raised:   { type: Boolean, default: false },
})

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'div'))
</script>

<style scoped>
.eui-card {
  display: block;
  border: 1px solid var(--surface-gray-3);
  background: var(--surface-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s, transform .15s;
  color: inherit;
  text-decoration: none;
}
.eui-card--raised { box-shadow: var(--shadow-sm); }
.eui-card--interactive { cursor: pointer; }
.eui-card--interactive:hover { border-color: var(--outline-gray-4, var(--surface-gray-4)); box-shadow: var(--shadow-md); }

[data-theme="dark"] .eui-card { background: var(--surface-cards); }

.eui-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--surface-gray-2);
  min-height: 50px;
}
.eui-card__header-slot { display: contents; }
.eui-card__icon {
  width: 16px; height: 16px;
  color: var(--ink-gray-5);
  flex-shrink: 0;
}
.eui-card__title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-gray-8);
  margin: 0;
  min-width: 0;
}
.eui-card__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--color-accent-subtle);
  color: var(--color-accent-ink);
}
.eui-card__actions { display: inline-flex; align-items: center; gap: 4px; }
.eui-card__body { padding: 16px 20px; }
.eui-card__body--flush { padding: 0; }
.eui-card__footer {
  padding: 12px 20px;
  border-top: 1px solid var(--surface-gray-2);
  background: var(--surface-gray-1);
}

@media (max-width: 640px) {
  .eui-card__header { padding: 12px 14px; min-height: 46px; }
  .eui-card__body { padding: 12px 14px; }
  .eui-card__footer { padding: 10px 14px; }
}
</style>
