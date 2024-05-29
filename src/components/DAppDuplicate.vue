<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 500px; max-width: 95vw" class="bg-white">
      <div>
        <!-- toolbar -->
        <div>
          <div class="row items-center q-px-sm q-py-xs bg-grey-4">
            <div class="text-h6 text-grey-7">
              Duplicate App
            </div>

            <q-space/>

            <q-btn no-caps dense flat class="q-px-sm" label="Cancel" @click="onDialogCancel"/>

            <div class="q-pr-sm"/>

            <q-btn no-caps dense color="primary" class="q-px-sm" label="Duplicate" @click="onSaveClick"/>
          </div>
        </div>

        <!-- body -->
        <div class="q-pa-lg">
          <div class="column no-wrap q-gutter-y-md">
            <div>
              <q-select outlined
                        emit-value map-options
                        label="To realm"
                        v-model="selectedRealmId"
                        :options="realmOps" />
            </div>

            <div>
              <q-input v-model="name" label="New name" outlined />
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
import { computed, ref } from "vue";
import { useStore } from "vuex";

const $q = useQuasar()
const store = useStore()

const props = defineProps({
  realmId : { type: String },
  name: { type: String },
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const selectedRealmId = ref(props.realmId || null)
const name = ref(props.name || null)
const realmOps = computed(() => _.map(store.state.realm.list, v => ({
  value: v.id,
  label: v.data.name,
})))

const onSaveClick = () => {
  onDialogOK({
    realm_id: selectedRealmId.value,
    name: name.value,
  })
}
</script>
