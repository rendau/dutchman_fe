<template>
  <div v-if="$route.meta.rid === rid">
    <ac-page-toolbar>
      <ac-page-title>
        <div class="text-bold">{{ app.name }}</div>

        <div class="q-pt-sm text-subtitle2">
          <div class="inline-block text-grey-8" style="min-width: 70px">Url:</div>
          <span class="text-grey-6">{{ $store.getters['data/selectedRealmBaseUrl'] }}</span>
          <span class="text-bold">/{{ app.path }}</span>
        </div>

        <div v-if="app.backend?.host" class="q-pt-xs text-subtitle2">
          <div class="inline-block text-grey-8" style="min-width: 70px">Backend:</div>
          <span class="text-grey-6">{{ $u.concatUrlPath(app.backend?.host || '', app.backend?.path) }}</span>
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

  <router-view v-else/>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
  rid: {},
})

const id = computed(() => (route.params.app_id || ''))
const realm = computed(() => store.getters['data/selectedRealm'])
const app = computed(() => (_.find(store.getters['data/selectedRealmApps'], { id: id.value }) || {}))

const onEditClick = () => {
  router.push({ name: 'app-edit', params: { app_id: id.value } })
}

watch(() => route.name, (v, ov) => {
  if (route.meta.rid === props.rid) {
    if (!app.value.id) {
      router.back()
    }
  }
})
</script>
