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

        <!-- timeout -->
        <div>
          <ac-label-input label="Timeout">
            <q-input dense outlined v-model="data.val.general.timeout"/>
          </ac-label-input>
        </div>
      </ac-input-group>

      <div class="q-pt-lg"/>

      <FormCorsConf v-model:data="data.val.general.cors_conf"/>

      <div class="q-pt-lg"/>

      <FormJwtConf v-model:data="data.val.general.jwt_conf"/>

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
import FormCorsConf from 'components/FormCorsConf.vue'
import FormJwtConf from 'components/FormJwtConf.vue'

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
      public_base_url: '',
      timeout: '120s',
      cors_conf: {
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
      jwt_conf: {
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
const realm = computed(() => store.getters['data/selectedRealm'])
const isCreating = computed(() => props.mode === 'create')

const fetch = () => {
  if (isCreating.value) {
    data.value = defaultData()
    return
  }

  if (!realm.value) {
    $q.notify({ type: 'negative', message: 'No realm selected' })
    router.back()
    return
  }
  data.value = _.defaultsDeep(_.cloneDeep(realm.value), defaultData())
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
