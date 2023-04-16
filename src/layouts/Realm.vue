<template>
  <div class="row items-center no-wrap">
    <div class="col">
      <q-select dense outlined
                emit-value map-options
                :label="selectedId ? undefined : 'Realm'"
                :model-value="selectedId"
                :options="ops"
                :loading="loading"
                bg-color="blue-1"
                @update:model-value="onInput">
        <template v-slot:[slotName]>
          <div v-close-popup class="fit">
            <q-btn dense flat no-caps
                   icon="add"
                   label="Add Realm"
                   color="positive"
                   class="fit q-py-sm"
                   @click="onCreateClick"/>
          </div>
        </template>
      </q-select>
    </div>

    <div class="col-auto q-pl-sm">
      <q-btn dense flat color="primary" :loading="deploying">
        <q-icon name="more_horiz" size="1.3rem"/>

        <q-menu>
          <q-list class="text-primary" dense>
            <!-- edit -->
            <q-item clickable v-close-popup @click="$router.push({name: 'realm-edit'})">
              <q-item-section>
                Edit
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="edit" size=".9rem"/>
              </q-item-section>
            </q-item>

            <!-- import config -->
            <q-item clickable v-close-popup>
              <q-item-section>
                <label class="cursor-pointer">
                  <input type="file" ref="importConfigFile" class="hidden" @change="onImportConfigFileSelected"/>
                  Import Config
                </label>
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="download_for_offline" size=".9rem"/>
              </q-item-section>
            </q-item>

            <!-- separator -->
            <q-separator/>

            <!-- preview -->
            <q-item clickable v-close-popup @click="onPreviewClick">
              <q-item-section>
                Preview JSON
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="remove_red_eye" size=".9rem"/>
              </q-item-section>
            </q-item>

            <!-- deploy -->
            <q-item clickable v-close-popup @click="onDeployClick">
              <q-item-section>
                Deploy
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="send" size=".9rem"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import DShowJson from 'components/DShowJson.vue'
import {previewConf} from "src/store/realm/actions";

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const ops = computed(() => _.map(store.state.realm.list, v => ({
  value: v.id,
  label: v.data.name,
})))
const selected = computed(() => store.getters['realm/selected'])
const selectedId = computed(() => store.getters['realm/selectedId'])
const loading = computed(() => store.getters['realm/loading'])
const deploying = ref(false)
const slotName = computed(() => (ops.value.length > 0 ? 'after-options' : 'no-option'))
const importConfigFile = ref(null)

const onInput = v => {
  router.push('/').then(() => store.dispatch('realm/select', v))
}

const onCreateClick = v => {
  router.push({ name: 'realm-create' })
}

const onImportConfigFileSelected = async e => {
  const file = e.target.files.item(0)
  if (!file) return

  store.dispatch('realm/importConf', {
    id: selectedId.value,
    data: file,
  }).then(() => {
    $q.notify({ message: 'Success imported', color: 'positive' })
  }, err => {
    $q.notify({ message: err, color: 'negative' })
  })
}

const onPreviewClick = () => {
  store.dispatch('realm/previewConf', selectedId.value).then(resp => {
    $q.dialog({
      component: DShowJson,
      componentProps: {
        data: JSON.stringify(resp.data, null, 4),
      },
    })
  })
}

const onDeployClick = () => {
  $q.dialog({
    message: 'Do you really want to deploy config?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    deploying.value = true
    store.dispatch('realm/deploy', selectedId.value).then(() => {
      $q.notify({ message: 'Success deployed', color: 'positive' })
    }, err => {
      $q.notify({ message: err.message, color: 'negative' })
    }).finally(() => {
      deploying.value = false
    })
  })
}
</script>
