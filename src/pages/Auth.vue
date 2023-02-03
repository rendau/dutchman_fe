<template>
  <div class="fullscreen flex flex-center q-pa-lg">
    <q-card class="relative-position" style="width: 370px">
      <div class="column items-stretch q-gutter-y-md q-pa-xl">
        <div>
          <div class="column flex-center q-gutter-y-sm">
            <div>
              <q-icon name="lock_person" color="grey-6" size="100px"/>
            </div>

            <div class="text-h4 text-grey-7">
              Log in
            </div>
          </div>
        </div>

        <div class="self-center" style="width: 250px">
          <q-input type="password"
                   v-model="password"
                   label="Пароль"
                   @keyup.enter="onSubmit"/>
        </div>

        <div class="self-center">
          <div class="q-pt-lg"/>

          <q-btn no-caps label="log in" color="positive" @click="onSubmit"/>
        </div>
      </div>

      <ac-spinner :showing="loading"/>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { cns } from 'boot/cns'

const $q = useQuasar()
const store = useStore()
const router = useRouter()

const loading = ref(false)
const password = ref('')

const messageH = event => {
  if (event.source === authWindow) {
    try {
      let data = JSON.parse(event.data || '{}')
      store.commit('profile/setToken', {
        access: data.access_token || '',
        refresh: data.refresh_token || '',
      })
      store.dispatch('profile/refresh', true).then(() => {
        if (store.getters['profile/isAuthed']) {
          router.push('/')
        } else {
          $q.notify({ type: 'negative', message: 'Не удалось авторизоваться' })
        }
      }, err => {
        $q.notify({ type: 'negative', message: err.data.desc })
      })
    } catch (e) {
      console.error(e)
      $q.notify({ type: 'negative', message: t(cns.ErrSystem) })
    }

    if (authWindow) {
      authWindow.close()
    }
  }
}

const onSubmit = () => {
  if (password.value === '') {
    $q.notify({ type: 'negative', message: 'Enter the password', })
    return
  }

  loading.value = true
  store.dispatch('profile/auth', password.value).then(() => {
    store.dispatch('profile/refresh', true).then(() => {
      if (store.getters['profile/isAuthed']) {
        router.push('/')
      } else {
        $q.notify({ type: 'negative', message: 'Fail to authorize' })
      }
    }, err => {
      $q.notify({ type: 'negative', message: err.data.desc })
    })
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc, })
  }).finally(() => {
    loading.value = false
  })

  // this.loading = true
  // this.$store.dispatch('profile/auth', {
  //   password: this.password,
  // }).then(() => {
  //   this.$router.push({ name: this.$cns.indexRouteName }).catch(() => {})
  // },err => {
  //   this.$q.notify({
  //     type: 'negative',
  //     message: err.data.desc,
  //   })
  // }).then(() => {
  //   this.loading = false
  // })
}
</script>
