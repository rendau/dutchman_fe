<template>
  <ac-input-group label="Backend">
    <!-- host -->
    <div>
      <ac-label-input label="Host (without path)">
        <q-input :model-value="data.host" dense outlined
                 @update:model-value="updateKey('host', $event)"/>
      </ac-label-input>
    </div>

    <!-- path -->
    <div>
      <ac-label-input label="Path prefix (only)">
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
  if (key === 'host') {
    let u = util.parseUrl(value)
    if (u) {
      obj[key] = u.origin
      if (u.pathname && u.pathname !== '/' && !props.data.path) {
        obj['path'] = util.normalizePath(u.pathname)
      }
    }
  } else if (key === 'path') {
    obj[key] = util.normalizePath(value)
  }
  emits('update:data', _.assign({}, props.data, obj))
}
</script>
