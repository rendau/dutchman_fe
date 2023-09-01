<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="height: 500px; width: 700px; max-width: 95vw" class="relative-position bg-white">
      <div class="column no-wrap items-stretch fit">
        <!-- toolbar -->
        <div class="col-auto">
          <div class="row items-center q-px-md q-py-sm bg-grey-4">
            <div class="text-h6 text-grey-7">
              JSON
            </div>

            <q-space/>

            <q-btn no-caps dense color="grey-7" class="q-px-sm" label="Close" @click="onDialogCancel"/>

            <div class="q-pr-sm"/>

            <q-btn no-caps dense color="positive" class="q-px-sm" label="Copy" @click="onCopyClick"/>
          </div>
        </div>

        <!-- body -->
        <div class="q-px-lg q-py-lg relative-position col fit">
          <textarea class="fit text-caption rounded-borders"
                    style="border: 1px solid #ccc; padding: 5px; resize: none; outline: none;"
                    readonly :value="data"/>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { copyToClipboard, useDialogPluginComponent, useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  data: { type: String, default: '' },
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const onCopyClick = () => {
  copyToClipboard(props.data).then(() => {
    $q.notify({ type: 'positive', message: 'Success copy!' })
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  })
}
</script>
