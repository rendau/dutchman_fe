<template>
  <div v-if="$route.meta.rid === rid">
    <ac-page-toolbar>
      <ac-page-title>
        Roles
      </ac-page-title>

      <q-space/>

      <div>
        <q-btn flat round icon="add" color="primary" @click="onAddClick"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <List :data="results" @item-click="onItemClick"/>
    </div>
  </div>

  <router-view v-else/>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import list from 'src/composables/list'

import List from 'components/role/List'

const route = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
  rid: {},
})

const filters = ref({
  app_id: null,
})
const { loading, results, refresh } = list('role/list', filters)

const onAddClick = () => {
  router.push({ name: 'roles-role_ce' })
}

const onItemClick = item => {
  router.push({ name: 'roles-role_ce', params: { role_id: item.id } })
}

watch(() => route.name, () => {
  if (route.meta.rid === props.rid) {
    refresh()
  }
})

onMounted(refresh)

defineExpose({
  refresh,
})
</script>
