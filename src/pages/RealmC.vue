<template>
  <div>
    <ac-page-toolbar>
      <ac-page-title>
        Create Realm
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="loading"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <!-- form -->
      <div class="column items-stretch q-gutter-y-md">
        <div>
          <ac-label-input label="Name">
            <q-input v-model="data.name" dense outlined/>
          </ac-label-input>
        </div>
      </div>

      <div class="q-pt-lg q-pb-md"/>

      <!-- actions -->
      <div class="row items-center q-gutter-md">
        <div>
          <q-btn no-caps color="primary" label="Save" @click="onSubmit"/>
        </div>

        <div>
          <q-btn no-caps flat color="primary" label="Cancel" @click="$router.back()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const loading = ref(false)
const data = ref({
  name: '',
  val: {
    general: {
      host: '0.0.0.0',
      port: '8080',
      timeout: '120s',
      cache_ttl: '300s',
      cors: {
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
        alg: 'RS256',
        jwk_url: '',
        disable_jwk_security: true,
        cache: true,
        cache_duration: '300',
      },
    },
  },
})

const onSubmit = () => {
  if (loading.value) return
  loading.value = true
  store.dispatch('data/create', data.value).then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
    router.replace({ name: 'realm-edit' })
  }).finally(() => {
    loading.value = false
  })
}
</script>
