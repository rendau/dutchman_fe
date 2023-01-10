<template>
  <div>
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
      <div class="column items-stretch q-gutter-y-md">
        <div>
          <ac-label-value label="Name">
            <q-input v-model="data.name" dense outlined/>
          </ac-label-value>
        </div>
      </div>

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
import { useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { cns } from 'boot/cns'

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const loading = ref(false)
const selectedRealm = computed(() => store.getters['data/selectedRealm'])
const data = ref({
  id: '',
  name: '',
  host: '',
})

const fetch = () => {
  if (!selectedRealm.value) {
    $q.notify({ type: 'negative', message: 'No realm selected' })
    router.back()
    return
  }
  data.value = {
    id: selectedRealm.value.id,
    name: selectedRealm.value.name,
  }
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
