<template>
  <ac-input-group label="Jwt Validation">
    <!-- enabled -->
    <div>
      <ac-label-input label="Enabled">
        <q-toggle :model-value="data.enabled || false"
                  @update:model-value="updateKey('enabled', $event)"/>
      </ac-label-input>
    </div>

    <!-- roles -->
    <div>
      <ac-label-input label="Roles">
        <ac-input-string-array :model-value="data.roles" :disable="!enabled"
                               emptyLabel="Any roles"
                               @update:model-value="updateKey('roles', $event)"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const emits = defineEmits()

const enabled = computed(() => props.data.enabled || false)

const updateKey = (key, value) => {
  emits('update:data', _.assign({}, props.data, { [key]: value }))
}
</script>
