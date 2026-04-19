<script setup>
import { DialogTrigger as RekaDialogTrigger } from 'reka-ui'
const props = defineProps({ asChild: { type: Boolean, default: false } })
</script>

<template>
  <RekaDialogTrigger :as-child="asChild">
    <slot />
  </RekaDialogTrigger>
</template>
