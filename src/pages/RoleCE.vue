<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Role' : 'Create role' }}
          </ac-page-title>
        </ac-page-toolbar>

        <div class="relative-position" style="min-height: 50px">
          <div v-if="!loading && data" class="row">
            <div class="col-12 col-md-10 col-lg-6">
              <div class="row items-start q-col-gutter-md">
                <!-- is_fetched -->
                <div v-if="data.is_fetched" class="col-12 text-negative">
                  Fetched
                </div>

                <!-- app_id -->
                <div class="col-12 col-md-6">
                  <q-select options-dense outlined map-options emit-value
                            label="App"
                            :readonly="!enabled"
                            v-model="data.app_id"
                            :options="appOps"/>
                </div>

                <div class="gt-sm col-6"/>

                <!-- code -->
                <div class="col-12 col-md-6">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Code"
                           v-model="data.data.code"/>
                </div>

                <!-- dsc -->
                <div class="col-12">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Description"
                           v-model="data.data.dsc"/>
                </div>
              </div>
            </div>
          </div>

          <template v-if="enabled">
            <div class="q-pt-lg q-pb-md"/>

            <div class="row items-center q-gutter-x-md">
              <div>
                <q-btn unelevated :label="isCreating ? 'Create' : 'Save'" color="positive" @click="onSubmitClick"/>
              </div>

              <div v-if="!isCreating">
                <q-btn unelevated label="Delete" color="negative" @click="onDeleteClick"/>
              </div>
            </div>
          </template>

          <div class="q-pt-lg"/>

          <ac-spinner :showing="loading"/>
        </div>
      </div>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n/index'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const id = computed(() => route.params.role_id || '')
const selectedRealmId = computed(() => store.getters['realm/selectedId'])
const isCreating = computed(() => !id.value)
const loading = ref(false)
const data = ref({
  app_id: null,
  is_fetched: false,
  data: {
    code: '',
    dsc: '',
  },
})
const enabled = computed(() => !data.value.is_fetched)
const appOps = computed(() => _.map(store.state.application.list, x => ({
  value: x.id,
  label: x.data.name,
})))

const fetch = () => {
  if (isCreating.value) return
  loading.value = true
  store.dispatch('role/get', id.value).then(resp => {
    data.value = resp.data
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).finally(() => {
    loading.value = false
  })
}

const onSubmitClick = () => {
  loading.value = true
  let pr
  if (isCreating.value) {
    pr = store.dispatch('role/create', data.value)
  } else {
    pr = store.dispatch('role/update', { id: id.value, data: data.value })
  }
  pr.then(() => {
    $q.notify({ type: 'positive', message: t('success_perform_msg') })
    router.back()
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
    loading.value = false
  })
}

const onDeleteClick = () => {
  $q.dialog({
    message: 'Are you sure you want to delete the role?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    loading.value = true
    store.dispatch('role/remove', id.value).then(() => {
      $q.notify({ type: 'positive', message: t('success_perform_msg') })
      router.back()
    }, err => {
      $q.notify({ type: 'negative', message: err.data.desc })
      loading.value = false
    })
  })
}

onMounted(fetch)
</script>
