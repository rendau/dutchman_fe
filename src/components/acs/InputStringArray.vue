<template>
  <q-input dense outlined>
    hello
  </q-input>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, default: () => [] },
})
</script>
