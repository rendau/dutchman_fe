<template>
  <div>
    <!-- toolbar -->
    <ac-page-toolbar>
      <ac-page-title>
        {{ isCreating ? 'Create' : 'Edit' }} Realm
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="loading || $store.state.data.loading"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <!-- form -->
      <ac-input-group>
        <!-- name -->
        <div>
          <ac-label-input label="Name">
            <q-input :autofocus="isCreating" v-model="data.name" dense outlined/>
          </ac-label-input>
        </div>

        <!-- conf_file_name -->
        <div>
          <ac-label-input label="Conf filename">
            <q-input v-model="data.val.general.conf_file_name" dense outlined/>
          </ac-label-input>
        </div>

        <!-- public_base_url -->
        <div>
          <ac-label-input label="Public base-url">
            <q-input v-model="data.val.general.public_base_url" dense outlined/>
          </ac-label-input>
        </div>

        <!-- host -->
        <div>
          <ac-label-input label="Listen host">
            <q-input v-model="data.val.general.host" dense outlined/>
          </ac-label-input>
        </div>

        <!-- port -->
        <div>
          <ac-label-input label="Listen port">
            <q-input dense outlined type="tel" v-model="data.val.general.port" mask="##########" unmasked-value/>
          </ac-label-input>
        </div>

        <!-- timeout -->
        <div>
          <ac-label-input label="Timeout">
            <q-input dense outlined v-model="data.val.general.timeout"/>
          </ac-label-input>
        </div>

        <!-- cache_ttl -->
        <div>
          <ac-label-input label="Cache TTL">
            <q-input dense outlined v-model="data.val.general.cache_ttl"/>
          </ac-label-input>
        </div>
      </ac-input-group>

      <div class="q-pt-lg"/>

      <FormCors v-model:data="data.val.general.cors"/>

      <div class="q-pt-lg"/>

      <FormJwtValidation v-model:data="data.val.general.jwt_validation"/>

      <div class="q-pt-lg q-pb-md"/>

      <!-- actions -->
      <div class="row items-center q-gutter-md">
        <div>
          <q-btn no-caps color="primary" label="Save" @click="onSubmit"/>
        </div>

        <div v-if="!isCreating">
          <q-btn no-caps color="negative" label="Delete" @click="onDelete"/>
        </div>

        <div>
          <q-btn no-caps flat color="primary" label="Cancel" @click="$router.back()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import FormCors from 'components/FormCors.vue'
import FormJwtValidation from 'components/FormJwtValidation.vue'

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const props = defineProps({
  mode: { type: String, default: 'create' },
})

const defaultData = () => ({
  id: '',
  name: '',
  val: {
    general: {
      conf_file_name: '',
      host: '0.0.0.0',
      port: '8080',
      timeout: '120s',
      cache_ttl: '300s',
      public_base_url: '',
      cors: {
        enabled: true,
        allow_origins: ['*'],
        allow_methods: [
          'GET',
          'HEAD',
          'POST',
          'PUT',
          'DELETE',
          'CONNECT',
          'OPTIONS',
          'TRACE',
          'PATCH',
        ],
        allow_headers: ['*'],
        expose_headers: ['*'],
        allow_credentials: true,
        max_age: '120h',
      },
      jwt_validation: {
        enabled: true,
        alg: 'RS256',
        jwk_url: '',
        disable_jwk_security: true,
        cache: true,
        cache_duration: '300',
      },
    },
  },
})

const loading = ref(false)
const data = ref(defaultData())
const selectedRealm = computed(() => store.getters['data/selectedRealm'])
const isCreating = computed(() => props.mode === 'create')

const fetch = () => {
  if (isCreating.value) {
    data.value = defaultData()
    return
  }

  if (!selectedRealm.value) {
    $q.notify({ type: 'negative', message: 'No realm selected' })
    router.back()
    return
  }
  data.value = _.defaultsDeep(_.cloneDeep(selectedRealm.value), defaultData())
}

const onSubmit = () => {
  if (loading.value) return
  if (!data.value.name) {
    $q.notify({ type: 'negative', message: 'Name is required' })
    return
  }
  loading.value = true
  data.value.val.general.public_base_url = _.trimEnd(data.value.val.general.public_base_url, '/')
  let pr = null
  if (isCreating.value) {
    pr = store.dispatch('data/create', data.value)
  } else {
    pr = store.dispatch('data/update', { id: data.value.id, data: data.value })
  }
  pr.then(() => {
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
    store.dispatch('data/remove', data.value.id).then(() => {
      $q.notify({ type: 'positive', message: 'Deleted' })
      router.back()
    }).finally(() => {
      loading.value = false
    })
  })
}

watch(() => isCreating.value, v => {
  fetch()
})

onMounted(() => fetch())
</script>
