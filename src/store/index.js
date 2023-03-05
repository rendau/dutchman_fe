import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import app from './app'
import config from './config'
import profile from './profile'
import data from './data'
import proxy_request from './proxy_request'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      app,
      config,
      profile,
      data,
      proxy_request,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  })

  return Store
})
