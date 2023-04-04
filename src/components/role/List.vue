<template>
  <div>
    <!-- toolbar -->
    <div class="q-pb-lg">
      <div class="row items-center q-gutter-x-md q-gutter-y-sm">
        <div>
          <q-select dense options-dense outlined map-options emit-value
                    v-model="filters.app_id"
                    :options="appOps"
                    style="width: 300px"
                    @update:model-value="refresh"/>
        </div>

        <q-space/>

        <div>
          <q-btn flat round icon="add" color="primary" @click="onAddClick"/>
        </div>
      </div>
    </div>

    <!-- table -->
    <q-markup-table flat bordered wrap-cells>
      <thead class="dense">
      <tr class="bg-grey-2 text-grey-6">
        <th class="min-width">Application</th>

        <th class="min-width">Code</th>

        <th class="text-left">Description</th>

        <th class="min-width text-no-wrap">Is Fetched</th>
      </tr>
      </thead>

      <tbody>
      <ListItem v-for="item in results" :key="`item-${item.id}`"
                :data="item" @click="onItemClick(item)"/>

      <ac-tr-no-rows v-if="!results.length"/>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import list from 'src/composables/list'

import ListItem from './ListItem'
import _ from 'lodash'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const filters = ref({
  app_id: null,
})
const { loading, results, refresh } = list('role/list', filters.value)
const appOps = computed(() => {
  return [
    { label: 'All applications', value: null },
    ..._.map(store.state.application.list, (app) => ({ label: app.data.name, value: app.id })),
  ]
})

const onAddClick = () => {
  router.push({ name: 'roles-role_ce', query: { app_id: filters.value.app_id || undefined } })
}

const onItemClick = item => {
  router.push({ name: 'roles-role_ce', params: { role_id: item.id } })
}

onMounted(refresh)

defineExpose({
  refresh,
})
</script>
