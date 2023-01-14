<template>
  <ac-input-group label="CORS">
    <!-- allow_origins -->
    <div>
      <ac-label-input label="Allow Origins">
        <InputStringArray :model-value="data.allow_origins"
                          @update:model-value="updateKey('allow_origins', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_methods -->
    <div>
      <ac-label-input label="Allow Methods">
        <InputStringArray :model-value="data.allow_methods"
                          @update:model-value="updateKey('allow_methods', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_headers -->
    <div>
      <ac-label-input label="Allow Headers">
        <InputStringArray :model-value="data.allow_headers"
                          @update:model-value="updateKey('allow_headers', $event)"/>
      </ac-label-input>
    </div>

    <!-- allow_credentials -->
    <div>
      <ac-label-input label="Allow Credentials">
        <q-toggle :model-value="data.allow_credentials || false"
                  @update:model-value="updateKey('allow_credentials', $event)"/>
      </ac-label-input>
    </div>

    <!-- max_age -->
    <div>
      <ac-label-input label="Max Age">
        <q-input :model-value="data.max_age" dense outlined
                 @update:model-value="updateKey('max_age', $event)"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'
import InputStringArray from 'components/acs/InputStringArray.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const emits = defineEmits()

const updateKey = (key, value) => {
  emits('update:data', _.assign({}, props.data, { [key]: value }))
}
</script>
