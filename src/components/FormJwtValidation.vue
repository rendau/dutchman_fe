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
        <ac-input-string-array :model-value="data.roles"
                               :disable="!enabled"
                               emptyLabel="Any roles"
                               :options="roleOps"
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
const apps = computed(() => [{ id: null, data: { name: 'No application' } }, ...store.state.application.list])
const roles = ref([])
const roleOps = computed(() => {
  // {
  //   value: 'value',
  //   label: 'label',
  //   children: [
  //     {
  //       value: 'value',
  //       label: 'label',
  //       caption: 'caption',
  //       side: 'side',
  //     },
  //   ],
  // }
  return _.filter(_.map(apps.value, app => {
    return {
      value: app.id,
      label: app.data?.name || '',
      children: _.map(_.filter(roles.value, { app_id: app.id }), role => {
        return {
          value: role.id,
          label: role.data?.code || '',
          caption: role.data?.dsc || '',
          side: 'side',
        }
      }),
    }
  }), app => app.children.length > 0)
})

const fetchRoles = () => {
  loading.value = true
  store.dispatch('role/list', {
    app_id_or_null: props.appId,
  }).then(resp => {
    roles.value = resp.data?.results || []
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
