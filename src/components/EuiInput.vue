<template>
  <label class="eui-input" :class="[`eui-input--${size}`, { 'eui-input--error': error, 'eui-input--disabled': disabled }]">
    <span v-if="label" class="eui-input__label">
      {{ label }}
      <span v-if="required" class="eui-input__required">*</span>
    </span>
    <span class="eui-input__wrap">
      <component v-if="iconLeft" :is="iconLeft" class="eui-input__icon eui-input__icon--left" aria-hidden="true" />
      <input
        v-if="as !== 'textarea'"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        class="eui-input__control"
        :class="{ 'eui-input__control--has-left': iconLeft, 'eui-input__control--has-right': iconRight }"
        @input="$emit('update:modelValue', $event.target.value)"
        @change="$emit('change', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <textarea
        v-else
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        class="eui-input__control eui-input__control--textarea"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <component v-if="iconRight" :is="iconRight" class="eui-input__icon eui-input__icon--right" aria-hidden="true" />
    </span>
    <span v-if="hint && !error" class="eui-input__hint">{{ hint }}</span>
    <span v-if="error" class="eui-input__error">{{ error }}</span>
  </label>
</template>

<script setup>
/*
 * EuiInput — text input & textarea.
 *
 * Props:
 *   as: 'input' | 'textarea'
 *   size: 'sm' | 'md' (default) | 'lg'
 *   type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
 *   iconLeft / iconRight: icon component (e.g. lucide)
 *   label, hint, error, required
 *
 * v-model binds the value string.
 */
defineProps({
  modelValue: { type: [String, Number], default: '' },
  as:       { type: String, default: 'input' },
  type:     { type: String, default: 'text' },
  size:     { type: String, default: 'md' },
  label:    { type: String, default: '' },
  placeholder: { type: String, default: '' },
  hint:     { type: String, default: '' },
  error:    { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  autocomplete: { type: String, default: null },
  inputmode:    { type: String, default: null },
  iconLeft:  { type: [Object, Function], default: null },
  iconRight: { type: [Object, Function], default: null },
  rows:     { type: Number, default: 3 },
})

defineEmits(['update:modelValue', 'change', 'blur', 'focus'])
</script>

<style scoped>
.eui-input { display: flex; flex-direction: column; gap: 4px; width: 100%; }
.eui-input__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-gray-7);
}
.eui-input__required { color: var(--color-danger); margin-left: 2px; }

.eui-input__wrap { position: relative; display: flex; align-items: center; width: 100%; }

.eui-input__control {
  width: 100%;
  background: var(--surface-white);
  border: 1px solid var(--outline-gray-3, var(--surface-gray-3));
  border-radius: var(--radius-md);
  color: var(--ink-gray-9);
  font-size: 14px;
  transition: border-color .12s, box-shadow .12s, background-color .12s;
  outline: none;
  font-family: inherit;
}
.eui-input__control::placeholder { color: var(--ink-gray-4); }
.eui-input__control:hover:not(:disabled):not(:focus) { border-color: var(--outline-gray-4, var(--surface-gray-4)); }
.eui-input__control:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
}
.eui-input__control:disabled,
.eui-input__control:read-only {
  background: var(--surface-gray-1);
  color: var(--ink-gray-5);
  cursor: not-allowed;
}

.eui-input--sm .eui-input__control { height: 28px; padding: 0 10px; font-size: 13px; }
.eui-input--md .eui-input__control { height: 34px; padding: 0 12px; font-size: 14px; }
.eui-input--lg .eui-input__control { height: 40px; padding: 0 14px; font-size: 15px; }
.eui-input__control--textarea { height: auto !important; padding: 8px 12px; resize: vertical; min-height: 72px; line-height: 1.5; }

.eui-input__control--has-left  { padding-left: 34px; }
.eui-input__control--has-right { padding-right: 34px; }

.eui-input__icon {
  position: absolute;
  width: 16px; height: 16px;
  color: var(--ink-gray-4);
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
}
.eui-input__icon--left  { left: 10px; }
.eui-input__icon--right { right: 10px; }

.eui-input--error .eui-input__control { border-color: var(--color-danger); }
.eui-input--error .eui-input__control:focus { box-shadow: 0 0 0 3px var(--color-danger-subtle); }

.eui-input__hint  { font-size: 12px; color: var(--ink-gray-5); }
.eui-input__error { font-size: 12px; color: var(--color-danger); }
</style>
