<template>
  <div>
    <ac-page-toolbar>
      <ac-page-title>
        {{ isCreating ? 'Create' : 'Edit' }} Application
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="loading"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <!-- form -->
      <div class="column items-stretch q-gutter-y-md">
        <!-- name -->
        <div>
          <ac-label-input label="Name">
            <q-input v-model="data.name" dense outlined/>
          </ac-label-input>
        </div>

        <!-- path -->
        <div>
          <ac-label-input label="Path prefix">
            <q-input v-model="data.path" dense outlined/>
          </ac-label-input>
        </div>
      </div>

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
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { uid, useQuasar } from 'quasar'
import { util } from 'boot/util'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()

const props = defineProps({
  mode: { type: String, default: 'create' },
})

const defaultData = () => ({
  id: uid(),
  name: '',
  path: '',
})

const loading = ref(false)
const data = ref(defaultData())

const id = computed(() => (route.params.app_id || ''))
const realm = computed(() => store.getters['data/selectedRealm'])
const realmApps = computed(() => store.getters['data/selectedRealmApps'])
const app = computed(() => (_.find(realmApps, { id: id.value }) || {}))
const isCreating = computed(() => props.mode === 'create')

const fetch = () => {
  if (isCreating.value) {
    data.value = defaultData()
    return
  }

  if (!app.value) {
    $q.notify({ type: 'negative', message: 'App not found' })
    router.back()
    return
  }
  data.value = _.defaultsDeep(_.cloneDeep(app.value), defaultData())
}

const onSubmit = () => {
  if (loading.value) return
  if (!data.value.name) {
    $q.notify({ type: 'negative', message: 'Name is required' })
    return
  }
  loading.value = true
  if (data.value.path) {
    data.value.path = _.trimStart(util.normalizePath(data.value.path), '/')
    data.value.path = '/' + data.value.path
  }
  data.value.path = _.trimStart(data.value.path, '/')
  let apps = [...realmApps.value, data.value]
  let val = _.assign({}, realm.value.val, { apps })
  store.dispatch('data/update', { id: realm.value.id, data: { val } }).then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
    router.back()
  }).finally(() => {
    loading.value = false
  })
}

const onDelete = () => {
  // if (loading.value) return
  // if (!data.value.id) return
  // $q.dialog({
  //   message: 'Do you really want to delete this record?',
  //   ok: { label: 'Yes', noCaps: true },
  //   cancel: { label: 'Cancel', flat: true, noCaps: true },
  // }).onOk(() => {
  //   loading.value = true
  //   store.dispatch('data/remove', data.value.id).then(() => {
  //     $q.notify({ type: 'positive', message: 'Deleted' })
  //     router.back()
  //   }).finally(() => {
  //     loading.value = false
  //   })
  // })
}

watch(() => isCreating.value, v => {
  fetch()
})

onMounted(() => fetch())
</script>
