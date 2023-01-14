<template>
  <div>
    <div class="row items-center rounded-borders br2 q-px-sm q-py-sm cursor-pointer"
         :style="readonly ? 'border-style: dashed' : ''"
         style="min-height: 40px" @click="onClick">
      <div class="row items-center q-gutter-y-xs q-gutter-x-sm">
        <div v-for="item in modelValue" :key="item">
          <q-chip dense color="grey-11" text-color="black" class="q-ma-none" :ripple="false">
            {{ item }}
          </q-chip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import DEditStringArray from 'components/DEditStringArray.vue'

const $q = useQuasar()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  readonly: { type: Boolean, default: false },
})

const emits = defineEmits()

const onClick = () => {
  if (props.readonly) return
  $q.dialog({
    component: DEditStringArray,
    componentProps: {
      data: props.modelValue,
    },
  }).onOk(data => {
    emits('update:model-value', data)
  })
}
</script>
