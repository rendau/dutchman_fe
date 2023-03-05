<template>
  <div v-if="$route.meta.rid === rid">
    <ac-page-toolbar>
      <ac-page-title>
        Permissions
      </ac-page-title>

      <q-space/>

      <div>
        <q-btn flat round icon="add" color="primary" @click="onAddClick"/>
      </div>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <List :data="items" @item-click="onItemClick"/>
    </div>
  </div>

  <router-view v-else/>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
import List from 'components/perm/List'

const route = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
  rid: {},
})

const id = computed(() => (route.params.app_id || ''))
const realm = computed(() => store.getters['data/selectedRealm'])
const items = computed(() => {
  return _.sortBy(
      store.getters['data/selectedRealmApps'].reduce((res, app) => {
        _.each(app.perms, perm => {
          res.push({
            app_name: app.name,
            code: perm.code,
            dsc: perm.dsc,
            is_all: perm.is_all,
            is_fetched: perm.is_fetched,
          })
        })
        return res
      }, []),
      ['app_name', 'code'],
  )
})

const onAddClick = () => {
  router.push({ name: 'perms-perm_ce' })
}

const onItemClick = item => {
  router.push({ name: 'perms-perm_ce', params: { perm_id: item.id } })
}
</script>
