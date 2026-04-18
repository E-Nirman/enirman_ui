<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    class="eui-list-row"
    :class="{ 'eui-list-row--interactive': !!(to || href || clickable) }"
    @click="$emit('click', $event)"
  >
    <div v-if="$slots.avatar" class="eui-list-row__avatar">
      <slot name="avatar" />
    </div>
    <div class="eui-list-row__main">
      <div class="eui-list-row__title-row">
        <span class="eui-list-row__title">{{ title }}</span>
        <slot name="title-badge" />
      </div>
      <span v-if="subtitle || $slots.subtitle" class="eui-list-row__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </span>
    </div>
    <div v-if="$slots.meta" class="eui-list-row__meta"><slot name="meta" /></div>
    <div v-if="$slots.actions" class="eui-list-row__actions" @click.stop>
      <slot name="actions" />
    </div>
    <svg v-if="(to || href) && !$slots.actions" class="eui-list-row__chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3 L11 8 L6 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </component>
</template>

<script setup>
import { computed } from 'vue'

/*
 * EuiListRow — a single row in a card-flush list (see EuiCard `flush`).
 *
 * Slots:
 *   #avatar — left-side avatar/icon (40x40 recommended)
 *   default prop `title` / `subtitle`, or slot #subtitle for complex content
 *   #title-badge — inline after title
 *   #meta — right-aligned secondary info (timestamps, counts)
 *   #actions — right-aligned action buttons (event-stopped)
 */
const props = defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  to:       { type: [String, Object], default: null },
  href:     { type: String, default: null },
  clickable:{ type: Boolean, default: false },
})
defineEmits(['click'])
const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'div'))
</script>

<style scoped>
.eui-list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--surface-gray-2);
  background: transparent;
  text-decoration: none;
  color: inherit;
  transition: background-color .12s;
}
.eui-list-row:last-child { border-bottom: none; }
.eui-list-row--interactive { cursor: pointer; }
.eui-list-row--interactive:hover { background: var(--surface-gray-1); }

.eui-list-row__avatar { flex-shrink: 0; }
.eui-list-row__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.eui-list-row__title-row { display: flex; align-items: center; gap: 6px; }
.eui-list-row__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-gray-8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.eui-list-row__subtitle {
  font-size: 12px;
  color: var(--ink-gray-5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.eui-list-row__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--ink-gray-5);
  flex-shrink: 0;
}
.eui-list-row__actions { display: flex; gap: 4px; flex-shrink: 0; }
.eui-list-row__chevron {
  width: 14px; height: 14px;
  color: var(--ink-gray-3);
  flex-shrink: 0;
  opacity: 0;
  transition: opacity .15s;
}
.eui-list-row--interactive:hover .eui-list-row__chevron { opacity: 1; }

@media (max-width: 640px) {
  .eui-list-row { padding: 10px 14px; gap: 10px; }
}
</style>
