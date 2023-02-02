<template>
  <div class="row items-center no-wrap">
    <div class="col">
      <q-select dense outlined
                emit-value map-options
                :label="selected ? undefined : 'Realm'"
                :model-value="selected?.name"
                :options="ops"
                :loading="loading"
                bg-color="blue-1"
                @update:model-value="onInput">
        <template v-slot:[slotName]>
          <div v-close-popup class="fit">
            <q-btn dense flat no-caps
                   icon="add"
                   label="Add Realm"
                   color="positive"
                   class="fit q-py-sm"
                   @click="onCreateClick"/>
          </div>
        </template>
      </q-select>
    </div>

    <div class="col-auto q-pl-sm">
      <q-btn dense flat color="primary">
        <q-icon name="more_horiz" size="1.3rem"/>

        <q-menu>
          <q-list class="text-primary" dense>
            <q-item clickable v-close-popup @click="$router.push({name: 'realm-edit'})">
              <q-item-section>
                Edit
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="edit" size=".9rem"/>
              </q-item-section>
            </q-item>

            <q-separator/>

            <q-item clickable v-close-popup @click="onPreviewClick">
              <q-item-section>
                Preview JSON
              </q-item-section>

              <q-item-section avatar>
                <q-icon name="remove_red_eye" size=".9rem"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { util } from 'boot/util'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import DShowJson from 'components/DShowJson.vue'

const router = useRouter()
const store = useStore()
const $q = useQuasar()

const ops = computed(() => util.lOps(store.state.data.realms))
const selected = computed(() => store.state.data.selectedRealm)
const loading = computed(() => store.state.data.loading)
const slotName = computed(() => (ops.value.length > 0 ? 'after-options' : 'no-option'))

const onInput = v => {
  router.push('/').then(() => {
    store.dispatch('data/select', v)
  })
}

const onCreateClick = v => {
  router.push({ name: 'realm-create' })
}

const onPreviewClick = () => {
  store.dispatch('data/generateConf').then(data => {
    $q.dialog({
      component: DShowJson,
      componentProps: {
        data,
      },
    })
  })
}
</script>
