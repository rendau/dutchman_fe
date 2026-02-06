<script setup>
import SelectableListItem from "components/endpoint/SelectableListItem.vue";
import {computed, ref} from "vue";

const props = defineProps({
  groupedItems: Object
})

const values = ref(props.groupedItems.map(group => ({
  ...group,
  items: group.items.map(item => ({...item, isChecked: true}))
})))

const isAllChecked = computed(() => values.value.map(group => group.items.map(item => item.isChecked)).flat().some(value => !value))

function onImport() {
  const data = JSON.stringify(values.value.map((group) => ({
    ...group,
    items: group.items.filter(item => item.isChecked).map(item => ({...item, isChecked: undefined, app_id: undefined, id: undefined}))
  })).filter(group => group.items.length).flatMap(item => item.items).flat(), null, 2)

  const blob = new Blob([data], {type: 'text/plain;charset=utf-8'})
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'data.txt'
  a.click()

  URL.revokeObjectURL(url)
}

function onSelectAll() {
  if (isAllChecked.value) values.value.forEach(group => group.items.forEach(item => item.isChecked = true))
  else values.value.forEach(group => group.items.forEach(item => item.isChecked = false))
}
</script>

<template>
  <div class="modal" style="height: 650px">
    <div style="height: 600px" class="modal-list">
      <div class="text-subtitle2 q-pb-xs text-grey-8">
        Endpoints:
      </div>
      <q-btn color="primary" size="md" flat dense :label="isAllChecked ? 'Select All' : 'Deselect All'" @click="onSelectAll" />
      <q-list v-for="group in values" :key="`grp-${group.path}`">
        <div class="text-subtitle1 text-weight-medium text-grey-8 q-pb-sm">
          /{{ group.path }}
        </div>
        <div class="q-pl-md">
          <q-markup-table flat bordered wrap-cells dense class="relative-position">
            <tbody>
            <SelectableListItem v-for="item in group.items" :key="`item-${group.path}-${item.id}`" :data="item" v-model="item.isChecked"/>
            </tbody>
          </q-markup-table>
        </div>
      </q-list>
    </div>
    <div class="modal-footer">
      <q-btn color="primary" @click="onImport">
        Export
      </q-btn>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  flex-direction: column;
}

.modal-list {
  flex: 1 1 0;
  overflow: auto;
}

.modal-footer {
  display: flex;
  justify-content: end;
  padding: 12px 0 0 0;
}
</style>
