<template>
  <div class="relative-position" style="min-height: 50px">
    <!-- header -->
    <div class="row items-center justify-between q-pb-xs">
      <div class="text-subtitle2 q-pb-xs text-grey-8">
        Endpoints:
      </div>

      <input
        ref="fileInput"
        type="file"
        accept=".json,.txt"
        class="hidden"
        @change="onFile"
      />
      <div v-if="results.length" class="row">

        <q-btn dense flat round icon="upload" color="primary" size=".9rem" @click="fileInput?.click()"/>
        <q-btn dense flat round icon="download" color="primary" size=".9rem" @click="onDownload"/>
        <!-- add button -->
        <q-btn dense flat round icon="add" color="primary" size=".9rem" @click="onAddClick"/>

      </div>
    </div>

    <!-- table -->
    <div class="column no-wrap items-stretch q-gutter-y-md">
      <div v-for="grp in groupedItems" :key="`grp-${grp.path}`">
        <div class="text-subtitle1 text-weight-medium text-grey-8 q-pb-sm">
          /{{ grp.path }}
        </div>

        <div class="q-pl-md">
          <q-markup-table flat bordered wrap-cells dense class="relative-position">
            <tbody>
            <ListItem v-for="item in grp.items" :key="`item-${item.id}`" :data="item"
                      @click="onItemClick(item)"/>
            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div v-if="!results.length" class="row">
        <q-btn dense flat no-caps icon="add" label="add endpoint" color="primary" class="col-6"
               @click="onAddClick"/>

        <q-btn
          dense
          flat
          no-caps
          icon="upload"
          label="Import endpoints"
          color="primary"
          class="col-6"
          @click="fileInput?.click()"
        />
      </div>
    </div>

    <ac-spinner :showing="loading"/>

    <q-dialog v-model="isDownloadOpen">
      <q-card>
        <q-card-section>
          <SelectableList :grouped-items="groupedItems"/>
        </q-card-section>
      </q-card>
    </q-dialog>


  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import list from 'src/composables/list'
import ListItem from './ListItem.vue'
import SelectableList from "components/endpoint/SelectableList.vue";
import {Dialog, useQuasar} from "quasar";
import CompareModal from "components/endpoint/CompareModal.vue";

const store = useStore()
const router = useRouter()
const $q = useQuasar()

const props = defineProps({
  app_id: {type: String, required: true},
})

const fileInput = ref(null)
const isDownloadOpen = ref(false)
const {loading, results, refresh} = list('endpoint/list', {app_id: props.app_id})
const endpoints = ref({newEndpoint: null, oldEndpoint: null})

const groupedItems = computed(() => {
  return _.sortBy(_.map(_.groupBy(results.value, x => _.head(_.split(x.data.path, '/'))), (v, k) => {
    return {path: k, items: v}
  }), 'path')
})


const onAddClick = () => {
  router.push({name: 'endpoint-create'})
}

const onItemClick = item => {
  router.push({name: 'endpoint-edit', params: {endpoint_id: item.id}})
}

const onDownload = () => isDownloadOpen.value = true

const onFile = (e) => {
  const file = (e.target).files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = async () => {
    try {
      const json = JSON.parse(reader.result)
      await onImport(json).then(async () => {
          $q.notify({type: 'positive', message: 'Saved'})
          await refresh()
        }
      )
    } catch (e) {
      $q.notify({type: 'negative', message: e})
      console.error('Invalid JSON', e)
    }
  }

  reader.readAsText(file)
}

const onImport = async (data) => {
  const oldValues = results.value.map(item => (JSON.stringify({...item, id: undefined})))
  for (const item of data) {
    const payload = {app_id: props.app_id, ...item}
    if (!oldValues.includes(JSON.stringify(payload))) {
      const sameEndpoint = results.value.find(endpoint => endpoint.data.method === payload.data.method && endpoint.data.path === payload.data.path)
      if (sameEndpoint) {
        endpoints.value.oldEndpoint = sameEndpoint
        endpoints.value.newEndpoint = payload
      } else {
        await store.dispatch('endpoint/create', payload)
      }
    }
  }
}

onMounted(refresh)

defineExpose({
  refresh,
})
</script>
