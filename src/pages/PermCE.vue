<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar bb>
          <ac-page-title>
            {{ id ? 'Permission' : 'Create permission' }}
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
                           v-model="data.code"/>
                </div>

                <!-- is_all -->
                <div class="col-12 col-md-6">
                  <q-toggle :disable="!enabled"
                            label="Is All"
                            v-model="data.is_all"/>
                </div>

                <!-- dsc -->
                <div class="col-12">
                  <q-input outlined
                           :readonly="!enabled"
                           label="Description"
                           v-model="data.dsc"/>
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
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n/index'
import { util } from 'boot/util'
import _ from 'lodash'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const id = computed(() => (parseInt(route.params.perm_id) || 0))
const isCreating = computed(() => !id.value)
const loading = ref(false)
const data = ref({
  app_id: null,
  code: '',
  dsc: '',
  is_all: false,
  is_fetched: false,
})
const realm = computed(() => store.getters['data/selectedRealm'])
const realmApps = computed(() => store.getters['data/selectedRealmApps'])
const appOps = computed(() => util.lOps(realmApps.value))
const app = computed(() => (_.find(realmApps.value, { id: data.value.app_id }) || {}))
const enabled = computed(() => !data.value.is_fetched)

const fetch = () => {
  if (isCreating.value) return

  _.each(realmApps.value, app => {
    _.each(app.perms, perm => {
      if (perm.id === id.value) {
        data.value = perm
        return false
      }
    })
    if (data.value.id) return false
  })
}

const onSubmitClick = () => {
  // loading.value = true
  // let apps = [...realmApps.value]
  // if (isCreating.value) {
  //   apps.push(data.value)
  // } else {
  //   apps = _.map(apps, a => (a.id === data.value.id ? data.value : a))
  // }
  // updateRealm(apps).then(() => {
  //   $q.notify({ type: 'positive', message: 'Saved' })
  //   router.back()
  // }).finally(() => {
  //   loading.value = false
  // })

  // loading.value = true
  // store.dispatch('perm/save', {
  //   id: id.value,
  //   data: data.value,
  // }).then(() => {
  //   $q.notify({ type: 'positive', message: t('success_perform_msg') })
  //   router.back()
  // }, err => {
  //   $q.notify({ type: 'negative', message: err.data.desc })
  //   loading.value = false
  // })
}

const onDeleteClick = () => {
  $q.dialog({
    message: 'Are you sure you want to delete the permission?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    // loading.value = true
    // store.dispatch('perm/remove', id.value).then(() => {
    //   $q.notify({ type: 'positive', message: t('success_perform_msg') })
    //   router.back()
    // }, err => {
    //   $q.notify({ type: 'negative', message: err.data.desc })
    //   loading.value = false
    // })
  })
}

const updateRealm = async perms => {
  let newApp = _.assign({}, app.value, { perms })
  let apps = _.map(realmApps.value, a => (a.id === app.value.id ? newApp : a))
  let val = _.assign({}, realm.value.val, { apps })
  return store.dispatch('data/update', { id: realm.value.id, data: { val } })
}

onMounted(fetch)
</script>
