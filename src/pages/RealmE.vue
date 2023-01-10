<template>
  <div>
    <ac-page-toolbar>
      <ac-page-title>
        {{ creating ? 'Create Realm' : 'Edit Realm' }}
      </ac-page-title>

      <div class="q-pl-md">
        <ac-spn v-if="loading"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <!-- form -->
      <div class="column items-stretch q-gutter-y-md">
        <div>
          <ac-label-value label="Name">
            <q-input v-model="data.name" dense outlined/>
          </ac-label-value>
        </div>
      </div>

      <div class="q-pt-lg q-pb-md"/>

      <!-- actions -->
      <div class="row items-center q-gutter-md">
        <div>
          <q-btn no-caps color="primary" label="Save" @click="onSubmit"/>
        </div>

        <div>
          <q-btn no-caps flat color="primary" label="Cancel" @click="$router.back()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()

const loading = ref(false)
const id = computed(() => route.params.id)
const creating = computed(() => !id.value)
const data = ref({
  name: '',
})

const onSubmit = () => {
  loading.value = true
  let pr
  if (creating.value) {
    pr = store.dispatch('data/create', data.value)
  } else {
    pr = store.dispatch('data/update', { id: id.value, data: data.value })
  }
  pr.then(() => {
    $q.notify({ type: 'positive', message: 'Saved' })
  }).finally(() => {
    loading.value = false
    router.back()
  })
}
</script>
