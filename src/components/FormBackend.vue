<template>
  <ac-input-group label="Backend">
    <!-- custom_path -->
    <div>
      <ac-label-input label="Custom path">
        <q-toggle :model-value="data.custom_path || false"
                  @update:model-value="updateKey('custom_path', $event)"/>
      </ac-label-input>
    </div>

    <!-- path -->
    <div>
      <ac-label-input label="Path">
        <q-input :model-value="isCustomPath ? data.path : default_path" dense outlined :disable="!isCustomPath"
                 @update:model-value="updateKey('path', $event)"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'
import { util } from 'boot/util'
import { computed } from 'vue'

const props = defineProps({
  default_path: { type: String, default: '' },
  data: { type: Object, default: () => ({}) },
})

const emits = defineEmits()

const isCustomPath = computed(() => props.data.custom_path || false)

const updateKey = (key, value) => {
  let obj = { [key]: value }
  if (key === 'path') {
    obj[key] = util.normalizePath(value)
  }
  emits('update:data', _.assign({}, props.data, obj))
}
</script>
