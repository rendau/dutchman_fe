<template>
  <div>
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
      <ListItem v-for="item in data" :key="`item-${item.id}`"
                :data="item" @click="$emit('item-click', item)"/>

      <ac-tr-no-rows v-if="!data.length"/>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import ListItem from './ListItem'

const props = defineProps({
  data: { type: Array, default: () => [] },
})
</script>
