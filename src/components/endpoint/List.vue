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

    <!-- table -->
    <div class="text-caption q-pb-xs text-grey-8">
      Endpoints:
    </div>

    <q-markup-table flat bordered wrap-cells dense class="relative-position">
      <tbody>
      <tr v-for="(item, itemI) in items" :key="`item-${itemI}-${item.path}`"
          class="cursor-pointer" @click="$emit('item-click', item)">
        <td class="text-right text-no-wrap">
          {{ item.method }}
        </td>

        <td class="text-no-wrap">
          {{ item.path }}
        </td>
      </tr>

      <ac-tr-no-rows v-if="!items.length"/>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  app: { type: Object, default: () => ({}) },
})

const items = computed(() => (props.app.endpoints || []))
</script>
