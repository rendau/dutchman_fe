<template>
  <ac-input-group label="Deploy settings">
    <!-- conf_file -->
    <div>
      <ac-label-input label="Conf file">
        <q-input :model-value="data.conf_file" dense outlined
                 @update:model-value="updateKey('conf_file', $event)"/>
      </ac-label-input>
    </div>

    <!-- url -->
    <div>
      <ac-label-input label="URL">
        <q-input :model-value="data.url" dense outlined
                 @update:model-value="updateKey('url', $event)"/>
      </ac-label-input>
    </div>

    <!-- method -->
    <div>
      <ac-label-input label="Method">
        <q-select v-model="data.method" dense outlined :options="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const emits = defineEmits()

const updateKey = (key, value) => {
  emits('update:data', _.assign({}, props.data, { [key]: value }))
}
</script>
