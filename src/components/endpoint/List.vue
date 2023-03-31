<template>
  <div class="relative-position" style="min-height: 50px">
    <!-- header -->
    <div class="row items-center justify-between q-pb-xs">
      <div class="text-subtitle2 q-pb-xs text-grey-8">
        Endpoints:
      </div>

      <div v-if="items.length">
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

      <div v-if="!items.length">
        <q-btn dense flat no-caps icon="add" label="add endpoint" color="primary"
               class="full-width" @click="onAddClick"/>
      </div>
    </div>

    <ac-spinner :showing="loading"/>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import list from 'src/composables/list'
import ListItem from './ListItem.vue'

const store = useStore()
const router = useRouter()

const props = defineProps({
  app_id: { type: String, required: true },
})

const { loading, results, refresh } = list('endpoint/list', { app_id: props.app_id })

const items = computed(() => _.sortBy(
    results.value || [],
    [
      x => !x.active,
      'data.path',
      'data.method',
    ],
))
const groupedItems = computed(() => {
  return _.sortBy(_.map(_.groupBy(items.value, x => _.head(_.split(x.data.path, '/'))), (v, k) => {
    return { path: k, items: v }
  }), 'path')
})

const onAddClick = () => {
  // router.push({ name: 'endpoint-create' })
}

const onItemClick = item => {
  router.push({ name: 'endpoint-edit', params: { endpoint_id: item.id } })
}

onMounted(refresh)

defineExpose({
  refresh,
})
</script>
