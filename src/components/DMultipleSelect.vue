<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 330px; max-width: 95vw" class="bg-white">
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
        <div style="height: 330px;" class="q-py-sm">
          <div class="scroll fit q-px-lg q-py-md">
            <q-list separator dense>
              <template v-for="grp in options" :key="`grp-${grp.value}`">
                <q-item-label class="text-secondary text-weight-medium q-pl-sm q-py-sm">
                  {{ grp.label }}:
                </q-item-label>

                <q-item v-for="item in grp.children" :key="`item-${item.value}`" tag="label" clickable>
                  <q-item-section side>
                    <q-checkbox dense v-model="val" :val="item.value"/>
                  </q-item-section>

                  <q-item-section>
                    <div class="text-weight-medium">
                      {{ item.label }}
                    </div>

                    <div v-if="item.caption" class="text-caption text-grey-6">
                      {{ item.caption }}
                    </div>
                  </q-item-section>

                  <q-item-section v-if="item.side" side class="text-caption">
                    {{ item.side }}
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

// optionExample
// {
//   value: 'value',
//   label: 'label',
//   children: [
//     {
//       value: 'value',
//       label: 'label',
//       caption: 'caption',
//       side: 'side',
//     },
//   ],
// }

const props = defineProps({
  options: { type: Array, default: () => [] },
  data: { type: Array, required: true },
})

const val = ref([...props.data])

const emits = defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const onSaveClick = () => {
  onDialogOK(val.value)
}
</script>
