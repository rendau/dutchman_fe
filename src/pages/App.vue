<template>
  <div v-if="$route.meta.rid === rid">
    <div class="relative-position" style="min-height: 50px">
      <template v-if="!loading && app">
        <ac-page-toolbar>
          <ac-page-title>
            <div class="text-bold">
              <div class="row no-wrap items-center">
                <div>{{ app.data.name }}</div>

                <!--            <div v-if="!app.active" class="inline-block q-ml-md text-body2 text-weight-regular">not active</div>-->
                <q-chip v-if="!app.active" dense label="not active"
                        color="grey-4" text-color="grey-8" class="q-ml-lg q-px-sm" size=".6rem" />
              </div>
            </div>

            <div class="q-pt-sm text-subtitle2">
              <div class="inline-block text-grey-8" style="min-width: 100px">Public Url:</div>
              <span class="text-grey-6">{{ $store.getters['realm/baseUrl'] }}</span>
              <span class="text-bold">/{{ app.data.path }}</span>
            </div>

            <div v-if="app.data.backend_base?.host" class="q-pt-xs text-subtitle2">
              <div class="inline-block text-grey-8" style="min-width: 100px">Backend Url:</div>
              <span class="text-grey-6">{{
                  $u.concatUrlPath(app.data.backend_base?.host || '', app.data.backend_base?.path)
                                        }}</span>
            </div>
          </ac-page-title>

          <q-space />

          <div>
            <div class="q-mr-sm">
              <q-btn flat round icon="content_copy" color="primary" @click="onDuplicateClick" />
            </div>
          </div>

          <div>
            <q-btn flat round icon="edit" color="primary" @click="onEditClick" />
          </div>
        </ac-page-toolbar>

        <!-- body -->
        <div>
          <div v-if="app">
            <EndpointList :app_id="id" @updated="fetch"/>
          </div>
        </div>
      </template>

      <ac-spinner :showing="loading" />
    </div>
  </div>

  <router-view v-else />
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import EndpointList from 'components/endpoint/List'
import { useQuasar } from 'quasar'
import { cns } from 'boot/cns'
import DAppDuplicate from 'components/DAppDuplicate.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()

const props = defineProps({
  rid: {},
})

const id = computed(() => (route.params.app_id || ''))
const realm = computed(() => store.getters['realm/selected'])
const app = ref(null)
const loading = ref(false)

const fetch = () => {
  if (!id.value) return
  loading.value = true
  app.value = null
  store.dispatch('application/get', id.value).then(resp => {
    app.value = resp.data
  }, err => {
    if (err.data.code === cns.ErrObjectNotFound) {
      router.back()
    } else {
      $q.notify({type: 'negative', message: err.data.desc})
    }
  }).finally(() => {
    loading.value = false
  })
}

const onDuplicateClick = () => {
  // console.log('duplicate', app.value)
  $q.dialog({
    component: DAppDuplicate,
    componentProps: {
      realmId: app.value.realm_id,
      name: app.value.data.name,
      host: app.value.data.backend_base.host
    },
  }).onOk(data => {
    loading.value = true
    store.dispatch('application/duplicate', {
      id: id.value,
      data: {
        new_realm_id: data.realm_id || null,
        new_name: data.name || null,
        new_host: data.host || null
      }
    }).catch(err => {
      $q.notify({type: 'negative', message: err.data.desc})
    }).finally(() => {
      loading.value = false
    })
  })
}

const onEditClick = () => {
  router.push({name: 'app-edit', params: {app_id: id.value}})
}

watch(() => route.name, () => {
  if (route.meta.rid === props.rid) {
    fetch()
  }
})
watch(() => id.value, () => fetch())

onMounted(() => fetch())
</script>
