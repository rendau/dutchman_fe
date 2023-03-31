import { cns } from 'boot/cns'

let ctxLoadSinceAppStartPr = null

export function auth (ctx, password) {
  console.log('auth')
  return this.$api.post('profile/auth', {
    password: password,
  }, { nfa: true, nl: true }).then(resp => {
    ctx.commit('setToken', {
      access: resp.data?.access_token || '',
      refresh: resp.data?.refresh_token || '',
    })
  })
}

export function refreshAccessToken (ctx) {
  console.log('refreshing access token')
  return this.$api.post('profile/auth/token', {
    refresh_token: ctx.getters['authTokenRefresh'],
  }, { nfa: true }).then(resp => {
    ctx.commit('setTokenAccess', resp.data?.access_token || '')
  })
}

export function refresh (ctx, nr401 = false) {
  console.log('start refresh-profile')
  return this.$api.get('profile', { nr401 }).then(resp => {
    return ctx.dispatch('set', resp.data).then(() => resp)
  })
}

export function refreshSinceAppStart (ctx) {
  if (!ctxLoadSinceAppStartPr) {
    console.log('start refresh-profile since app-start')
    ctxLoadSinceAppStartPr = ctx.dispatch('refresh', true).catch(err => {
      if (err.data?.code === cns.ErrNotAuthorized) {
        return Promise.resolve(null)
      } else {
        // console.error(err)
        return Promise.reject(err)
      }
    })
  }

  return ctxLoadSinceAppStartPr
}

export function resetCtxLoadSinceAppStartPr () {
  ctxLoadSinceAppStartPr = null
}

export function logout (ctx) {
  return ctx.dispatch('set', null)
}

export function set (ctx, value) {
  if (!value) {
    ctx.commit('setToken', { access: '', refresh: '' })
  }

  let loggedIn = !ctx.state.ctx && !!value

  ctx.commit('setCtx', value)

  if (loggedIn) {
    return ctx.dispatch('afterLogin')
  }
}

export function afterLogin (ctx) {
  return Promise.all([
    ctx.dispatch('config/get', null, { root: true }),
    ctx.dispatch('realm/list', null, { root: true }),
  ])
}
