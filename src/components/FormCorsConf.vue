<template>
  <ac-input-group label="CORS Settings">
    <!-- enabled -->
    <div>
      <ac-label-input label="Enabled">
        <q-toggle :model-value="data.enabled || false"
                  @update:model-value="updateKey('enabled', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_origins -->
    <div>
      <ac-label-input label="Allow Origins">
        <ac-input-string-array :model-value="data.allow_origins" :disable="!enabled"
                               @update:model-value="updateKey('allow_origins', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_methods -->
    <div>
      <ac-label-input label="Allow Methods">
        <ac-input-string-array :model-value="data.allow_methods" :disable="!enabled"
                               @update:model-value="updateKey('allow_methods', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_headers -->
    <div>
      <ac-label-input label="Allow Headers">
        <ac-input-string-array :model-value="data.allow_headers" :disable="!enabled"
                               @update:model-value="updateKey('allow_headers', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_credentials -->
    <div>
      <ac-label-input label="Allow Credentials">
        <q-toggle :model-value="data.allow_credentials || false" :disable="!enabled"
                  @update:model-value="updateKey('allow_credentials', $event)"/>
      </ac-label-input>
    </div>

    <!-- max_age -->
    <div>
      <ac-label-input label="Max Age">
        <q-input :model-value="data.max_age" dense outlined :disable="!enabled"
                 @update:model-value="updateKey('max_age', $event)"/>
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
