<template>
  <div>
    <!-- filters -->
    <!--    <div class="q-pb-md">-->
    <!--      <div class="row items-start q-gutter-x-lg q-gutter-y-md">-->
    <!--        &lt;!&ndash; banks &ndash;&gt;-->
    <!--        <div class="col-auto">-->
    <!--          <q-select outlined dense-->
    <!--                    emit-value map-options-->
    <!--                    :label="params.prv_id ? undefined : 'Все банки'"-->
    <!--                    :model-value="params.prv_id"-->
    <!--                    :options="$u.lOps('prvs')"-->
    <!--                    style="width: 250px"-->
    <!--                    @update:model-value="onPrvInput"/>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!-- header -->
    <div class="row items-center justify-between q-pb-xs">
      <div class="text-subtitle2 q-pb-xs text-grey-8">
        Endpoints:
      </div>

      <div v-if="items.length">
        <!-- add button -->
        <q-btn dense flat round icon="add" color="primary" size=".8rem" @click="onAddClick"/>
      </div>
    </div>

    <!-- table -->
    <q-markup-table flat bordered wrap-cells dense class="relative-position">
      <tbody>
      <tr v-for="(item, itemI) in items" :key="`item-${itemI}-${item.path}`"
          class="cursor-pointer" @click="onItemClick(item)">
        <td class="text-right text-no-wrap min-width text-grey-8">
          {{ item.method }}
        </td>

        <td class="text-no-wrap text-subtitle2">
          /{{ item.path }}
        </td>

        <td class="text-center min-width">
          <div class="row no-wrap items-center justify-end q-gutter-sm">
            <span v-if="item.ip_validation?.enabled" class="text-caption text-bold text-blue-grey-4">IP</span>

            <q-icon v-if="item.jwt_validation?.enabled" name="lock" color="blue-grey-4" size=".85rem"/>
          </div>
        </td>
      </tr>

      <tr v-if="!items.length">
        <td colspan="100%">
          <q-btn dense flat no-caps icon="add" label="add endpoint" color="primary"
                 class="full-width" @click="onAddClick"/>
        </td>
      </tr>
      </tbody>
    </q-markup-table>
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

const items = computed(() => _.sortBy(props.app.endpoints || [], 'path'))

const onAddClick = () => {
  router.push({ name: 'endpoint-create' })
}

const onItemClick = item => {
  router.push({ name: 'endpoint-edit', params: { endpoint_id: item.id } })
}
</script>
