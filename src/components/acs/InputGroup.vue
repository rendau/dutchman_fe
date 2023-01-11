<template>
  <div>
    <div v-if="label" class="text-subtitle1 text-grey-7 q-pb-sm">
      {{ label }}
    </div>

    <div class="column items-stretch q-gutter-y-sm"
         :class="($store.getters['app/screenSmall'] ? 'q-pl-sm' : 'q-pl-md')">
      <slot/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, default: '' },
})
</script>
