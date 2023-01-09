<template>
  <q-drawer :model-value="$store.state.app.drawer" show-if-above bordered
            content-class="bg-grey-1" :width="280"
            @update:model-value="$store.commit('app/setDrawer', $event)">
    <div class="column no-wrap items-stretch q-gutter-y-sm">
      <!-- header -->
      <div>
        <div class="row no-wrap flex-center text-primary q-pt-md q-pb-sm">
          <q-icon name="token" size="25px"/>

          <div class="text-h6 q-pl-sm">
            Dutchman
          </div>
        </div>
      </div>

      <!-- realm select -->
      <div class="col-auto">
        <div class="q-px-lg">
          <RealmSelect/>
        </div>
      </div>

      <!-- menus -->
      <div>
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
      </div>

      <!-- logout -->
      <div class="col-auto">
        <div class="q-pt-lg q-px-lg">
          <RealmSelect/>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import RealmSelect from './RealmSelect.vue'

const store = useStore()

const selectedRealm = computed(() => store.state.data.selectedRealm)

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
</script>
