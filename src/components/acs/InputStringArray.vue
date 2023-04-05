<template>
  <div>
    <div class="row items-center rounded-borders br2 q-px-sm q-py-sm"
         :class="disable ? 'cursor-not-allowed' : 'cursor-pointer'"
         style="min-height: 40px" @click="onClick"
         :style="disable ? 'border-style: dashed' : ''">
      <div class="row items-center q-gutter-y-xs q-gutter-x-sm">
        <div v-for="item in modelValue" :key="item">
          <q-chip dense color="grey-11" text-color="black" class="q-ma-none" :ripple="false">
            {{ item }}
          </q-chip>
        </div>

        <div v-if="!modelValue.length && emptyLabel" class="text-grey-6">
          {{ emptyLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import DEditStringArray from 'components/DEditStringArray.vue'
import DMultipleSelect from 'components/DMultipleSelect.vue'

const $q = useQuasar()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  emptyLabel: { type: String, default: '' },
  disable: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
})

const emits = defineEmits()

const onClick = () => {
  if (props.disable) return
  if (props.options.length > 0) {
    $q.dialog({
      component: DMultipleSelect,
      componentProps: {
        options: props.options,
        data: props.modelValue,
      },
    }).onOk(data => {
      emits('update:model-value', data)
    })
  } else {
    $q.dialog({
      component: DEditStringArray,
      componentProps: {
        data: props.modelValue,
      },
    }).onOk(data => {
      emits('update:model-value', data)
    })
  }
}
</script>
