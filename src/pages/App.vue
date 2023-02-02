<template>
  <div v-if="$route.meta.rid === rid">
    <ac-page-toolbar>
      <ac-page-title>
        <div class="text-bold">
          <div class="row no-wrap items-center">
            <div>{{ app.name }}</div>

<!--            <div v-if="!app.active" class="inline-block q-ml-md text-body2 text-weight-regular">not active</div>-->
            <q-chip v-if="!app.active" dense label="not active"
                    color="grey-4" text-color="grey-8" class="q-ml-lg q-px-sm" size=".6rem"/>
          </div>
        </div>

        <div class="q-pt-sm text-subtitle2">
          <div class="inline-block text-grey-8" style="min-width: 90px">Public Url:</div>
          <span class="text-grey-6">{{ $store.getters['data/selectedRealmBaseUrl'] }}</span>
          <span class="text-bold">/{{ app.path }}</span>
        </div>

        <div v-if="app.backend_base?.host" class="q-pt-xs text-subtitle2">
          <div class="inline-block text-grey-8" style="min-width: 90px">Backend Url:</div>
          <span class="text-grey-6">{{ $u.concatUrlPath(app.backend_base?.host || '', app.backend_base?.path) }}</span>
        </div>
      </ac-page-title>

      <q-space/>

      <div>
        <q-btn flat round icon="edit" color="primary" @click="onEditClick"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <EndpointList :app="app"/>
    </div>
  </div>

  <router-view v-else/>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import EndpointList from 'components/endpoint/List'

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
