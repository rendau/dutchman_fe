<template>
  <div>
    <ac-page-toolbar>
      <ac-page-title>
        Create Application
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

        <div>
          <q-btn no-caps flat color="primary" label="Cancel" @click="$router.back()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { uid, useQuasar } from 'quasar'

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const loading = ref(false)
const data = ref({
  id: uid(),
  name: '',
  path: '',
})

const realm = computed(() => store.getters['data/selectedRealm'])
const realmApps = computed(() => store.getters['data/selectedRealmApps'])

const onSubmit = () => {
  if (loading.value) return
  loading.value = true
  let apps = [...realmApps.value, data.value]
  let val = _.assign({}, realm.value.val, { apps })
  store.dispatch('data/update', { id: realm.value.id, data: { val } }).then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
    router.back()
  }).finally(() => {
    loading.value = false
  })
}
</script>
