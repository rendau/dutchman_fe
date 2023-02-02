<template>
  <ac-input-group label="IP Validation">
    <!-- enabled -->
    <div>
      <ac-label-input label="Enabled">
        <q-toggle :model-value="data.enabled || false"
                  @update:model-value="updateKey('enabled', $event)"/>
      </ac-label-input>
    </div>

    <!-- allowed_ips -->
    <div>
      <ac-label-input label="Allowed IPs">
        <ac-input-string-array :model-value="data.allowed_ips" :disable="!enabled"
                                emptyLabel="Any IPs"
                               @update:model-value="updateKey('allowed_ips', $event)"/>
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
