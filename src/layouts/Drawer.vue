<template>
  <q-drawer :model-value="$store.state.app.drawer" show-if-above bordered
            content-class="bg-grey-1" :width="280"
            @update:model-value="$store.commit('app/setDrawer', $event)">
    <q-select outlined options-dense clearable
              emit-value map-options
              :model-value="$store.state.data.selectedRealm"
              :options="$u.lOps($store.state.data.realms)"
              @update:model-value="onInputRealm">
    </q-select>

    <q-list class="q-py-md">
      <q-item v-for="m in menus" :key="`menu-${m.name}`" dense class="q-pl-lg"
              :to="m.route" active-class="bg-primary text-white">
        <q-item-section side style="color: inherit">
          <q-icon :name="m.icon" size="1.1rem"/>
        </q-item-section>

        <q-item-section class="q-py-sm q-pl-sm">
          {{ m.label }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const menus = computed(() => [
  {
    label: 'Menu1',
    icon: 'home',
    // route: { name: 'orders' },
  },
  {
    label: 'Menu2',
    icon: 'label',
    // route: { name: 'prvs' },
  },
  {
    label: 'Menu3',
    icon: 'label',
    // route: { name: 'refund_notify_rules' },
  },
])

const onInputRealm = v => {
  store.dispatch('data/select', v)
}

onMounted(() => {
  store.dispatch('data/list')
})
</script>
