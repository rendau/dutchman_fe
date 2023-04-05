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
                               :loading="loading"
                               @update:model-value="updateKey('roles', $event)"/>
      </ac-label-input>
    </div>
  </ac-input-group>
</template>

<script setup>
import _ from 'lodash'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  appId: { type: String, required: true },
})

const emits = defineEmits()

const enabled = computed(() => props.data.enabled || false)
const loading = ref(false)
const apps = computed(() => store.state.application.list)
const roles = ref([])

const fetchRoles = () => {
  loading.value = true
  store.dispatch('role/list', {
    app_id_or_null: props.appId,
  }).then(resp => {
    roles.value = resp.data
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).finally(() => {
    loading.value = false
  })
}

const updateKey = (key, value) => {
  emits('update:data', _.assign({}, props.data, { [key]: value }))
}

onMounted(() => fetchRoles())
</script>
