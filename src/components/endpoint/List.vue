<template>
  <div>
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
            <tr v-for="(item, itemI) in grp.items" :key="`item-${itemI}-${item.path}`"
                class="cursor-pointer" :class="{'text-grey-6': !item.active}"
                @click="onItemClick(item)">
              <td class="text-right text-no-wrap text-weight-light min-width">
                <div style="min-width: 56px">
                  {{ item.method }}
                </div>
              </td>

              <td class="text-no-wrap text-subtitle2">
                <div class="q-pl-sm">
                  /{{ item.path }}
                </div>
              </td>

              <td class="text-center min-width">
                <div class="row no-wrap items-center justify-end q-gutter-sm">
                  <span v-if="item.ip_validation?.enabled" class="text-caption text-bold text-blue-grey-4">IP</span>

                  <q-icon v-if="item.jwt_validation?.enabled" name="lock" color="blue-grey-4" size=".85rem"/>
                </div>
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>

      <div v-if="!items.length">
        <q-btn dense flat no-caps icon="add" label="add endpoint" color="primary"
               class="full-width" @click="onAddClick"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const props = defineProps({
  app: { type: Object, default: () => ({}) },
})

const items = computed(() => _.sortBy(
    props.app.endpoints || [],
    [
      x => !x.active,
      'path',
      'method',
    ],
))
const groupedItems = computed(() => {
  return _.sortBy(_.map(_.groupBy(items.value, x => _.head(_.split(x.path, '/'))), (v, k) => {
    return { path: k, items: v }
  }), 'path')
})

const onAddClick = () => {
  router.push({ name: 'endpoint-create' })
}

const onItemClick = item => {
  router.push({ name: 'endpoint-edit', params: { endpoint_id: item.id } })
}
</script>
