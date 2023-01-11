<template>
  <div>
    <!-- toolbar -->
    <ac-page-toolbar>
      <ac-page-title>
        Edit Realm
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
            <q-input v-model="data.name" dense outlined/>
          </ac-label-input>
        </div>

        <!-- host -->
        <div>
          <ac-label-input label="Host">
            <q-input v-model="data.val.host" dense outlined/>
          </ac-label-input>
        </div>

        <!-- port -->
        <div>
          <ac-label-input label="Port">
            <q-input dense outlined type="tel" v-model="data.val.port" mask="##########" unmasked-value/>
          </ac-label-input>
        </div>

        <!-- timeout -->
        <div>
          <ac-label-input label="Timeout">
            <q-input dense outlined v-model="data.val.timeout"/>
          </ac-label-input>
        </div>

        <!-- cache_ttl -->
        <div>
          <ac-label-input label="Cache TTL">
            <q-input dense outlined v-model="data.val.cache_ttl"/>
          </ac-label-input>
        </div>
      </ac-input-group>

      <div class="q-pt-lg q-pb-md"/>

      <!-- actions -->
      <div class="row items-center q-gutter-md">
        <div>
          <q-btn no-caps color="primary" label="Save" @click="onSubmit"/>
        </div>

        <div>
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

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const loading = ref(false)
const selectedRealm = computed(() => store.getters['data/selectedRealm'])
const data = ref({
  id: '',
  name: '',
  val: {
    host: '',
    port: '',
    timeout: '',
    cache_ttl: '',
  },
})

const fetch = () => {
  if (!selectedRealm.value) {
    $q.notify({ type: 'negative', message: 'No realm selected' })
    router.back()
    return
  }
  data.value = _.cloneDeep(selectedRealm.value)
}

const onSubmit = () => {
  loading.value = true
  store.dispatch('data/update', { id: data.value.id, data: data.value }).then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
    router.back()
  }).finally(() => {
    loading.value = false
  })
}

const onDelete = () => {
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

watch(() => store.state.data.selectedRealm, () => fetch())

onMounted(() => fetch())
</script>
