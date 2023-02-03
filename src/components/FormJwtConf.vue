<template>
  <ac-input-group label="Jwt Settings">
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
                 @update:model-value="onUpdateCacheDuration"/>
      </ac-label-input>
    </div>

    <!-- roles_key -->
    <div>
      <ac-label-input label="Roles key">
        <q-input :model-value="data.roles_key" dense outlined
                 @update:model-value="updateKey('roles_key', $event)"/>
      </ac-label-input>
    </div>

    <!-- roles_key_is_nested -->
    <div>
      <ac-label-input label="Roles key is nested">
        <q-toggle :model-value="data.roles_key_is_nested || false"
                  @update:model-value="updateKey('roles_key_is_nested', $event)"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  data: { type: Object, default: () => ({}) },
})

const emits = defineEmits()

const updateKey = (key, value) => {
  emits('update:data', _.assign({}, props.data, { [key]: value }))
}

const onUpdateCacheDuration = value => {
  let v = parseInt(value) || -1
  if (v < 0) {
    $q.notify({ message: 'Cache duration must be an integer', color: 'negative', })
    return
  }

  updateKey('cache_duration', v)
}
</script>
