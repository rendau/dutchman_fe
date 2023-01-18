<template>
  <div>
    <ac-page-toolbar>
      <ac-page-title>
        <div class="text-bold">{{ app.name }}</div>

        <div class="q-pt-sm text-subtitle2">
          <span class="text-grey-6">{{ $store.getters['data/selectedRealmBaseUrl'] }}</span>
          <span class="text-bold">/{{ $_.trimStart(app.path, '/') }}</span>
        </div>
      </ac-page-title>

      <q-space/>

      <div>
        <q-btn flat round icon="edit" color="primary" @click="onEditClick"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      hello
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const id = computed(() => (route.params.app_id || ''))
const realm = computed(() => store.getters['data/selectedRealm'])
const app = computed(() => (_.find(store.getters['data/selectedRealmApps'], { id: id.value }) || {}))

const onEditClick = () => {
  router.push({ name: 'app-edit', params: { app_id: id.value } })
}
</script>
