<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 95vw" class="bg-white">
      <div>
        <!-- toolbar -->
        <div>
          <div class="row items-center q-px-sm q-py-xs bg-grey-4">
            <div class="text-h6 text-grey-7">
            </div>

            <q-space/>

            <q-btn no-caps dense flat class="q-px-sm" label="Cancel" @click="onDialogCancel"/>

            <div class="q-pr-sm"/>

            <q-btn no-caps dense color="primary" class="q-px-sm" label="Apply" @click="onSaveClick"/>
          </div>
        </div>

        <!-- body -->
        <div style="height: 300px;" class="q-py-sm">
          <div class="scroll fit q-px-lg q-py-md">
            <div class="column no-wrap items-stretch q-gutter-y-sm">
              <div v-for="(item, itemI) in d" :key="`item-${itemI}`">
                <q-input v-model="d[itemI]" dense outlined>
                  <template #after>
                    <q-btn dense flat icon="delete" color="negative" @click="onDeleteClick(itemI)"/>
                  </template>
                </q-input>
              </div>

              <div class="row justify-center">
                <q-btn no-caps color="positive" icon="add" label="Add item" @click="onAddItemClick"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import _ from 'lodash'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const d = ref([...props.data])

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const onSaveClick = () => {
  onDialogOK(d.value)
}

const onAddItemClick = () => {
  d.value.push('')
}

const onDeleteClick = itemI => {
  d.value.splice(itemI, 1)
}
</script>
