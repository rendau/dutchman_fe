<template>
  <div v-if="loading > 0" class="fullscreen">
    <ac-spinner :showing="true"/>
  </div>

  <div v-else-if="appError" class="fullscreen column flex-center q-px-lg text-center">
    <div class="q-py-md">
      <q-icon name="warning" color="negative" size="3.5rem"/>
    </div>

    <div class="text-body1 text-negative">
      {{ $t(appError) }}
    </div>
  </div>

  <router-view v-else/>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { cns } from 'boot/cns'

const store = useStore()

const loading = computed(() => store.state.app.loading)
const appError = computed(() => store.state.app.appError)

// store.commit('profile/setTokenAccess', '')
// store.commit('profile/setTokenRefresh', '')

onMounted(() => {
  store.commit('app/addLoading')

  store.dispatch('profile/refreshSinceAppStart').catch(err => {
    console.error('Fail to start app', err)
    store.commit('app/setAppError', cns.ErrServiceNotAvailable)
  }).then(() => {
    store.commit('app/removeLoading')
    store.dispatch('app/resolveAppStartPr')
  })
})
</script>
