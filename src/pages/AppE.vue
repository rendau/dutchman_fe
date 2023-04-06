<template>
  <div>
    <ac-page-toolbar bb>
      <ac-page-title>
        {{ isCreating ? 'Create' : 'Edit' }} Application
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="loading"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div class="relative-position" style="min-height: 50px">
      <!-- form -->
      <ac-input-group>
        <!-- active -->
        <div>
          <ac-label-input label="Active">
            <q-toggle v-model="data.active"/>
          </ac-label-input>
        </div>

        <!-- name -->
        <div>
          <ac-label-input label="Name">
            <q-input v-model="data.data.name" dense outlined/>
          </ac-label-input>
        </div>

        <!-- path -->
        <div>
          <ac-label-input label="Path prefix">
            <q-input v-model="data.data.path" dense outlined/>
          </ac-label-input>
        </div>
      </ac-input-group>

      <div class="q-pt-lg"/>

      <FormBackendBase v-model:data="data.data.backend_base"/>

      <div class="q-pt-lg"/>

      <!-- remote_roles -->
      <ac-input-group label="Permissions">
        <!-- url -->
        <div>
          <ac-label-input label="URL">
            <q-input v-model="data.data.remote_roles.url" dense outlined/>
          </ac-label-input>
        </div>

        <!-- json_path -->
        <div>
          <ac-label-input label="JSON path ('.' delimiter)">
            <q-input v-model="data.data.remote_roles.json_path" dense outlined/>
          </ac-label-input>
        </div>
      </ac-input-group>

      <div class="q-pt-lg q-pb-md"/>

      <!-- actions -->
      <div class="row items-center q-gutter-md">
        <div>
          <q-btn no-caps color="primary" label="Save" @click="onSubmit"/>
        </div>

        <div v-if="!isCreating">
          <q-btn no-caps color="negative" label="Delete" @click="onDelete"/>
        </div>
      </div>

      <ac-spinner :showing="loading"/>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { util } from 'boot/util'
import FormBackendBase from 'components/FormBackendBase.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()

const props = defineProps({
  mode: { type: String, default: 'create' },
})

const loading = ref(false)
const data = ref({
  active: true,
  data: {
    name: '',
    path: '',
    backend_base: {
      host: '',
      path: '',
    },
    endpoints: [],
    remote_roles: {
      url: '',
      json_path: '',
    },
  },
})

const id = computed(() => (route.params.app_id || ''))
const realmId = computed(() => store.getters['realm/selectedId'])
const isCreating = computed(() => props.mode === 'create')

const fetch = () => {
  if (isCreating.value) {
    data.value.realm_id = realmId.value
    return
  }
  store.dispatch('application/get', id.value).then(resp => {
    if (resp.data?.data) {
      resp.data.data = _.defaultsDeep(resp.data.data, data.value.data)
    }
    data.value = resp.data
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).finally(() => {
    loading.value = false
  })
}

const onSubmit = () => {
  if (loading.value) return
  if (!data.value.data.name) {
    $q.notify({ type: 'negative', message: 'Name is required' })
    return
  }
  loading.value = true
  data.value.data.path = util.normalizePath(data.value.data.path)
  let pr
  if (isCreating.value) {
    pr = store.dispatch('application/create', data.value)
  } else {
    pr = store.dispatch('application/update', { id: id.value, data: data.value })
  }
  pr.then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
    router.back()
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).finally(() => {
    loading.value = false
  })
}

const onDelete = () => {
  if (loading.value) return
  if (!id.value) return
  $q.dialog({
    message: 'Do you really want to delete this record?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    store.dispatch('application/remove', id.value).then(() => {
      $q.notify({ type: 'positive', message: 'Deleted' })
      router.go(-2)
    }, err => {
      $q.notify({ type: 'negative', message: err.data.desc })
    }).finally(() => {
      loading.value = false
    })
  })
}

watch(() => isCreating.value, () => fetch())

onMounted(() => fetch())
</script>
