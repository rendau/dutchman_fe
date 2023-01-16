<template>
  <q-drawer :model-value="$store.state.app.drawer" show-if-above bordered
            class="q-ma-none"
            content-class="bg-grey-1" :width="280"
            @update:model-value="$store.commit('app/setDrawer', $event)">
    <div class="fit relative-position column no-wrap items-stretch">
      <!-- header/logo -->
      <div class="col-auto">
        <div class="row no-wrap flex-center text-primary q-pt-md">
          <q-icon name="token" size="25px"/>

          <div class="text-h6 q-pl-sm">Dutchman</div>
        </div>
      </div>

      <!-- realm select -->
      <div class="col-auto q-pt-sm">
        <div class="q-pl-md q-pr-sm q-pt-xs">
          <RealmSelect/>
        </div>
      </div>

      <div class="col-auto q-pt-md">
        <q-separator/>
      </div>

      <!-- menus -->
      <div class="col q-pt-xs">
        <q-list class="fit scroll-y">
          <q-item-label header>Route groups</q-item-label>

          <q-item v-for="m in menus" :key="`menu-${m.name}`" dense class="q-pl-md"
                  :to="m.route" active-class="bg-primary text-white">
            <q-item-section side style="color: inherit">
              <q-icon name="lan" size="1.1rem"/>
            </q-item-section>

            <q-item-section class="q-py-xs q-pl-xs">
              {{ m.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- logout -->
      <div v-if="$store.getters['profile/isAuthed']" class="col-auto q-pt-xs q-pb-sm">
        <div class="row flex-center q-px-lg">
          <div>
            <q-btn dense flat round color="primary" @click="onLogout">
              <q-icon name="logout" size="1.2rem"/>
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import RealmSelect from './RealmSelect.vue'
import { cns } from 'boot/cns'

const store = useStore()
const router = useRouter()
const $q = useQuasar()

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

const onLogout = () => {
  $q.dialog({
    message: 'Do you really want to leave?',
    ok: { label: 'Yes', noCaps: true },
    cancel: { label: 'Cancel', flat: true, noCaps: true },
  }).onOk(() => {
    store.dispatch('profile/logout').then(() => {
      router.push({ name: cns.authRouteName })
    })
  })
}
</script>
