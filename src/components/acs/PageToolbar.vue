<template>
  <div>
    <div class="row items-center q-pr-md q-py-sm relative-position">
      <div v-if="bb" class="q-pr-lg">
        <q-btn dense outline round color="grey-4" @click="$router.back()">
          <q-icon name="chevron_left" color="grey-7"/>
        </q-btn>
      </div>

      <slot/>
    </div>

    <div v-if="!noSeparator" class="q-pt-md">
      <q-separator/>
    </div>

    <div class="q-pb-lg"/>
  </div>
</template>

<script setup>
const props = defineProps({
  bb: { type: Boolean },
  noSeparator: { type: Boolean },
})
</script>
