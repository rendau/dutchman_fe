<template>
  <div class="row no-wrap items-center q-gutter-x-md">
    <div class="col-auto text-subtitle2"
        :style="{'width': ($store.getters['app/screenSmall'] ? '105px' : '250px')}">
      {{ label }}
    </div>

    <div class="col" style="max-width: 400px">
      <slot/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String },
})
</script>
