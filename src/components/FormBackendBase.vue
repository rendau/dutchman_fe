<template>
  <ac-input-group label="Backend base">
    <!-- host -->
    <div>
      <ac-label-input label="Host (without path)">
        <q-input :model-value="data.host" dense outlined
                 @update:model-value="updateKey('host', $event)"/>
      </ac-label-input>
    </div>

    <!-- path -->
    <div>
      <ac-label-input label="Path prefix">
        <q-input :model-value="data.path" dense outlined
                 @update:model-value="updateKey('path', $event)"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'
import { util } from 'boot/util'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const emits = defineEmits()

const updateKey = (key, value) => {
  let obj = { [key]: value }
  emits('update:data', _.assign({}, props.data, obj))
}
</script>
