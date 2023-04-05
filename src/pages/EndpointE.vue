<template>
  <div>
    <!-- toolbar -->
    <ac-page-toolbar bb>
      <ac-page-title>
        {{ isCreating ? 'Create' : 'Edit' }} Endpoint
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="fetching"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div class="relative-position" style="min-height: 50px">
      <template v-if="!fetching && data">
        <div>
          <div class="q-pt-sm text-subtitle2">
            <div class="inline-block text-grey-8" style="min-width: 100px">Public Url:</div>
            <span class="cursor-pointer"
                  @click="copyTextClick($u.concatUrlPath($store.getters['realm/baseUrl'], app.data.path, data.data.path))">
            <span class="text-grey-6">{{ $store.getters['realm/baseUrl'] }}/{{ app.data.path }}</span>
            <span class="text-bold">/{{ data.data.path }}</span>
          </span>
          </div>

          <div v-if="app.data.backend_base?.host" class="q-pt-xs text-subtitle2">
            <div class="inline-block text-grey-8" style="min-width: 100px">Backend Url:</div>
            <span class="cursor-pointer"
                  @click="copyTextClick($u.concatUrlPath(app.data.backend_base?.host || '', app.data.backend_base?.path, (data.data.backend.custom_path ? data.data.backend.path : data.data.path)))">
            <span class="text-grey-6">{{
                $u.concatUrlPath(app.data.backend_base?.host || '', app.data.backend_base?.path)
              }}</span>
            <span class="text-bold">/{{ (data.data.backend.custom_path ? data.data.backend.path : data.data.path) }}
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
              <q-select v-model="data.data.method" dense outlined :options="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"/>
            </ac-label-input>
          </div>

          <!-- path -->
          <div>
            <ac-label-input label="Path">
              <q-input v-model="data.data.path" dense outlined/>
            </ac-label-input>
          </div>
        </ac-input-group>

        <div class="q-pt-lg"/>

        <FormBackend v-model:data="data.data.backend" :default_path="data.data.path"/>

        <div class="q-pt-lg"/>

        <FormJwtValidation v-model:data="data.data.jwt_validation" :appId="appId"/>

        <div class="q-pt-lg"/>

        <FormIPValidation v-model:data="data.data.ip_validation"/>

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
      </template>

      <ac-spinner :showing="fetching || loading"/>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { copyToClipboard, useQuasar } from 'quasar'
import { util } from 'src/boot/util'
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

const defaultData = () => ({
  active: true,
  data: {
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
  },
})

const fetching = ref(false)
const loading = ref(false)
const app = ref(null)
const data = ref(null)

const appId = computed(() => (route.params.app_id || ''))
const id = computed(() => (route.params.endpoint_id || ''))
const isCreating = computed(() => props.mode === 'create')

const fetch = () => {
  fetching.value = true
  Promise.all([
    fetchApp(),
    fetchData(),
  ]).catch( err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).finally(() => {
    fetching.value = false
  })
}

const fetchApp = () => {
  return store.dispatch('application/get', appId.value).then(resp => {
    app.value = resp.data
  })
}

const fetchData = () => {
  if (isCreating.value) {
    data.value = defaultData()
    data.value.app_id = appId.value
    return
  }
  return store.dispatch('endpoint/get', id.value).then(resp => {
    data.value = resp.data
  })
}

const onSubmit = () => {
  if (loading.value) return
  if (!data.value.data.method) {
    $q.notify({ type: 'negative', message: 'Method is required' })
    return
  }
  loading.value = true
  data.value.data.path = util.normalizePath(data.value.data.path)
  let pr
  if (isCreating.value) {
    pr = store.dispatch('endpoint/create', data.value)
  } else {
    pr = store.dispatch('endpoint/update', { id: id.value, data: data.value })
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
    store.dispatch('endpoint/remove', id.value).then(() => {
      $q.notify({ type: 'positive', message: 'Deleted' })
      router.back()
    }, err => {
      $q.notify({ type: 'negative', message: err.data.desc })
    }).finally(() => {
      loading.value = false
    })
  })
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
