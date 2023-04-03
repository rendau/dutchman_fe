<template>
  <q-list class="relative-position">
    <q-item-label header class="q-pb-sm">
      <div class="row no-wrap items-center">
        <div class="col">
          Applications
        </div>

        <div class="q-pl-sm">
          <q-btn dense flat round icon="add" color="primary" size="0.7rem" @click="onAddClick"/>
        </div>
      </div>
    </q-item-label>

    <q-item v-for="item in items" :key="`item-${item.id}`" dense class="q-pl-md"
            :to="{name: 'app', params: {app_id: item.id}}" active-class="bg-primary text-white">
      <q-item-section side style="color: inherit">
        <q-icon name="lan" size="1.1rem"/>
      </q-item-section>

      <q-item-section class="q-py-xs q-pl-xs" :class="{'text-grey-6': !item.active}">
        {{ item.data.name }}
      </q-item-section>
    </q-item>

    <ac-spinner :showing="loading"/>
  </q-list>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const items = computed(() => store.state.application.list || [])
const loading = computed(() => store.getters['application/loading'])

const onAddClick = () => {
  router.push({ name: 'app-create' })
}
</script>
