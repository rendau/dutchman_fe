<template>
  <q-drawer :model-value="$store.state.app.drawer" show-if-above bordered
            class="q-ma-none"
            content-class="bg-grey-1" :width="280"
            @update:model-value="$store.commit('app/setDrawer', $event)">
    <div class="fit relative-position column no-wrap items-stretch">
      <!-- header/logo -->
      <div class="col-auto cursor-pointer" @click="router.push('/')">
        <div class="row no-wrap flex-center text-primary q-pt-md">
          <q-img no-spinner no-transition src="~assets/logo.png" width="25px" height="25px"/>

          <div class="text-h6 q-pl-sm non-selectable">Dutchman</div>
        </div>
      </div>

      <!-- realm select -->
      <div class="col-auto q-pt-sm">
        <div class="q-pl-md q-pr-sm q-pt-xs">
          <Realm/>
        </div>
      </div>

      <div class="col-auto q-pt-md">
        <q-separator/>
      </div>

      <!-- menus -->
      <div class="col q-pt-xs">
        <div class="fit scroll-y">
          <AppList/>
        </div>
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
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { cns } from 'boot/cns'
import Realm from 'layouts/Realm.vue'
import AppList from 'layouts/AppList.vue'

const store = useStore()
const router = useRouter()
const $q = useQuasar()

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
