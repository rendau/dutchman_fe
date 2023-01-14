<template>
  <ac-input-group label="Jwt Validation">
    <!-- alg -->
    <div>
      <ac-label-input label="Algorithm">
        <q-select dense options-dense outlined
                  :model-value="data.alg"
                  :options="[
                      'HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512', 'EdDSA'
                  ]"
                  @update:model-value="updateKey('alg', $event)"/>
      </ac-label-input>
    </div>

    <!-- jwk_url -->
    <div>
      <ac-label-input label="Jwk Url">
        <q-input :model-value="data.jwk_url" dense outlined
                 @update:model-value="updateKey('jwk_url', $event)"/>
      </ac-label-input>
    </div>

    <!-- disable_jwk_security -->
    <div>
      <ac-label-input label="Disable Jwk Security">
        <q-toggle :model-value="data.disable_jwk_security || false"
                  @update:model-value="updateKey('disable_jwk_security', $event)"/>
      </ac-label-input>
    </div>

    <!-- cache -->
    <div>
      <ac-label-input label="Cache">
        <q-toggle :model-value="data.cache || false"
                  @update:model-value="updateKey('cache', $event)"/>
      </ac-label-input>
    </div>

    <!-- cache_duration -->
    <div>
      <ac-label-input label="Cache Duration">
        <q-input :model-value="data.cache_duration" dense outlined
                 suffix="sec"
                 @update:model-value="updateKey('cache_duration', $event)"/>
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
