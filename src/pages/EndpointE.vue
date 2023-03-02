<template>
  <div>
    <!-- toolbar -->
    <ac-page-toolbar bb>
      <ac-page-title>
        {{ isCreating ? 'Create' : 'Edit' }} Endpoint
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="loading"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <div>
        <div class="q-pt-sm text-subtitle2">
          <div class="inline-block text-grey-8" style="min-width: 100px">Public Url:</div>
          <span class="cursor-pointer"
                @click="copyTextClick($u.concatUrlPath($store.getters['data/selectedRealmBaseUrl'], app.path, data.path))">
            <span class="text-grey-6">{{ $store.getters['data/selectedRealmBaseUrl'] }}/{{ app.path }}</span>
            <span class="text-bold">/{{ data.path }}</span>
          </span>
        </div>

        <div v-if="app.backend_base?.host" class="q-pt-xs text-subtitle2">
          <div class="inline-block text-grey-8" style="min-width: 100px">Backend Url:</div>
          <span class="cursor-pointer"
                @click="copyTextClick($u.concatUrlPath(app.backend_base?.host || '', app.backend_base?.path, (data.backend.custom_path ? data.backend.path : data.path)))">
            <span class="text-grey-6">{{
                $u.concatUrlPath(app.backend_base?.host || '', app.backend_base?.path)
              }}</span>
            <span class="text-bold">/{{ (data.backend.custom_path ? data.backend.path : data.path) }}
            </span>
          </span>
        </div>
      </div>

      <div class="q-pt-lg"/>

      <!-- form -->
      <ac-input-group>
        <!-- active -->
        <div>
          <ac-label-input label="Active">
            <q-toggle v-model="data.active"/>
          </ac-label-input>
        </div>

        <!-- method -->
        <div>
          <ac-label-input label="Method">
            <q-select v-model="data.method" dense outlined :options="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"/>
          </ac-label-input>
        </div>

        <!-- path -->
        <div>
          <ac-label-input label="Path">
            <q-input v-model="data.path" dense outlined/>
          </ac-label-input>
        </div>
      </ac-input-group>

      <div class="q-pt-lg"/>

      <FormBackend v-model:data="data.backend" :default_path="data.path"/>

      <div class="q-pt-lg"/>

      <FormJwtValidation v-model:data="data.jwt_validation"/>

      <div class="q-pt-lg"/>

      <FormIPValidation v-model:data="data.ip_validation"/>

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
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { copyToClipboard, uid, useQuasar } from 'quasar'
import { util } from 'boot/util'
import FormBackend from 'components/FormBackend.vue'
import FormJwtValidation from 'components/FormJwtValidation.vue'
import FormIPValidation from 'components/FormIPValidation.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()

const props = defineProps({
  mode: { type: String, default: 'create' },
})

const defaultData = id => ({
  id: id || '',
  active: true,
  method: 'GET',
  path: '',
  backend: {
    custom_path: false,
    path: '',
  },
  jwt_validation: {
    enabled: false,
    roles: [],
  },
  ip_validation: {
    enabled: false,
    allowed_ips: [],
  },
})

const loading = ref(false)
const data = ref(defaultData())

const realm = computed(() => store.getters['data/selectedRealm'])
const realmApps = computed(() => store.getters['data/selectedRealmApps'])
const app_id = computed(() => (route.params.app_id || ''))
const app = computed(() => (_.find(realmApps.value, { id: app_id.value }) || {}))
const id = computed(() => (route.params.endpoint_id || ''))
const isCreating = computed(() => props.mode === 'create')

const fetch = () => {
  if (isCreating.value) {
    data.value = defaultData(uid())
    return
  }

  let endpoint = _.find(app.value.endpoints || [], { id: id.value }) || {}
  if (!endpoint) {
    $q.notify({ type: 'negative', message: 'Endpoint not found' })
    router.back()
    return
  }
  data.value = _.defaults(_.clone(endpoint), defaultData())
}

const onSubmit = () => {
  if (loading.value) return
  if (!data.value.method) {
    $q.notify({ type: 'negative', message: 'Method is required' })
    return
  }
  loading.value = true
  data.value.path = util.normalizePath(data.value.path)
  let endpoints = [...(app.value.endpoints || [])]
  if (isCreating.value) {
    endpoints.push(data.value)
  } else {
    endpoints = _.map(endpoints, a => (a.id === data.value.id ? data.value : a))
  }
  updateRealm(endpoints).then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
    router.back()
  }).finally(() => {
    loading.value = false
  })
}

const onDelete = () => {
  if (loading.value) return
  if (!data.value.id) return
  $q.dialog({
    message: 'Do you really want to delete this record?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    let endpoints = _.reject(app.value.endpoints, x => x.id === data.value.id)
    updateRealm(endpoints).then(() => {
      $q.notify({ type: 'positive', message: 'Deleted' })
      router.back()
    }).finally(() => {
      loading.value = false
    })
  })
}

const updateRealm = async endpoints => {
  let newApp = _.assign({}, app.value, { endpoints })
  let apps = _.map(realmApps.value, a => (a.id === app.value.id ? newApp : a))
  let val = _.assign({}, realm.value.val, { apps })
  return store.dispatch('data/update', { id: realm.value.id, data: { val } })
}

const copyTextClick = txt => {
  copyToClipboard(txt).then(() => {
    $q.notify({ type: 'positive', message: 'Success copy!' })
  }, err => {
    $q.notify({ type: 'negative', message: err })
  })
}

watch(() => isCreating.value, () => fetch())

onMounted(() => fetch())
</script>
