<script setup>
import { DialogClose as RekaDialogClose } from 'reka-ui'
const props = defineProps({ asChild: { type: Boolean, default: false } })
</script>

<template>
  <RekaDialogClose :as-child="asChild">
    <slot />
  </RekaDialogClose>
</template>
