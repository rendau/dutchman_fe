<template>
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
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { util } from 'boot/util'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const ops = computed(() => util.lOps(store.state.data.realms))
const selected = computed(() => store.state.data.selectedRealm)
const loading = computed(() => store.state.data.loading)
const slotName = computed(() => (ops.value.length > 0 ? 'after-options' : 'no-option'))

const onInput = v => {
  store.dispatch('data/select', v)
}

const onCreateClick = v => {
  router.push({ name: 'realm-create' })
}
</script>
