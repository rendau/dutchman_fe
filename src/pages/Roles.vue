<template>
  <div :class="{'hidden': $route.meta.rid !== rid}">
    <ac-page-toolbar>
      <ac-page-title>
        Roles
      </ac-page-title>
    </ac-page-toolbar>

    <!-- body -->
    <div>
      <List ref="listRef"/>
    </div>
  </div>

  <router-view v-if="$route.meta.rid !== rid"/>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

import List from 'components/role/List'

const route = useRoute()

const props = defineProps({
  rid: {},
})

const listRef = ref(null)

watch(() => route.name, () => {
  if (route.meta.rid === props.rid) {
    listRef.value.refresh && listRef.value.refresh()
  }
})
</script>
