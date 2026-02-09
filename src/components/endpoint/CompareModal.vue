<script setup>
import {useDialogPluginComponent} from "quasar";

const props = defineProps({
  endpoints: {
    newEndpoint: Object,
    oldEndpoint: Object
  }
})

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK} = useDialogPluginComponent()

function onSelect(value) {
  if (value === 'old') {
    onDialogOK(props.endpoints.oldEndpoint)
  }
  else {
    onDialogOK(props.endpoints.newEndpoint)
  }
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <p>
      There is same endpoint, with some differences, select one of them
    </p>
    <q-card class="flex">
      <q-card-section class="flex-1">
        old
        <button @click="onSelect('old')">
          <pre>
            {{ endpoints.oldEndpoint }}
          </pre>
        </button>
      </q-card-section>
      <q-card-section class="flex-1 flex flex-col">
        new
        <button @click="onSelect('new')">
          <pre>
            {{ endpoints.newEndpoint }}
          </pre>
        </button>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
button {
  text-align: start;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0
}

.flex-col {
  flex-direction: column;
}
</style>
