<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const props = defineProps({
  endpoints: {
    type: Object,
    required: true
  }
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent()

const selected = ref(null)

const selectOld = () => {
  selected.value = 'old'
}

const selectNew = () => {
  selected.value = 'new'
}

const confirm = () => {
  if (selected.value === 'old') {
    onDialogOK(props.endpoints.oldEndpoint)
  } else if (selected.value === 'new') {
    onDialogOK(props.endpoints.newEndpoint)
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" maximized>
    <q-card class="column full-height">

      <!-- HEADER -->
      <q-card-section class="text-h6">
        Duplicate endpoint detected
        <div class="text-caption text-grey-6">
          Choose which version you want to keep
        </div>
      </q-card-section>

      <q-separator />

      <!-- CONTENT -->
      <q-card-section class="row q-col-gutter-md flex-1 overflow-hidden">

        <!-- OLD -->
        <q-card
          flat
          bordered
          class="col selectable"
          :class="{ selected: selected === 'old' }"
          @click="selectOld"
        >
          <q-card-section class="text-subtitle2 text-grey-7">
            Existing endpoint
          </q-card-section>

          <q-separator />

          <q-card-section class="scroll">
            <pre>{{ endpoints.oldEndpoint }}</pre>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              outline
              color="primary"
              label="Use this"
              @click.stop="selectOld"
            />
          </q-card-actions>
        </q-card>

        <!-- NEW -->
        <q-card
          flat
          bordered
          class="col selectable"
          :class="{ selected: selected === 'new' }"
          @click="selectNew"
        >
          <q-card-section class="text-subtitle2 text-grey-7">
            Imported endpoint
          </q-card-section>

          <q-separator />

          <q-card-section class="scroll">
            <pre>{{ endpoints.newEndpoint }}</pre>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              outline
              color="primary"
              label="Use this"
              @click.stop="selectNew"
            />
          </q-card-actions>
        </q-card>

      </q-card-section>

      <q-separator />

      <!-- FOOTER -->
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn
          unelevated
          color="primary"
          label="Confirm"
          :disable="!selected"
          @click="confirm"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<style scoped>
.selectable {
  cursor: pointer;
  transition: all 0.15s ease;
}

.selectable:hover {
  border-color: var(--q-primary);
}

.selected {
  border: 2px solid var(--q-primary);
  background: rgba(25, 118, 210, 0.04);
}

pre {
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
