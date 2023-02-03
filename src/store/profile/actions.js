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

    return ctx.dispatch('initLoads')
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
    ctxLoadSinceAppStartPr = ctx.dispatch('refresh', true).then(() => {
      return ctx.dispatch('initLoads')
    }, err => {
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

export function initLoads (ctx) {
  return Promise.all([
    ctx.dispatch('dic/get', null, { root: true }),
    ctx.dispatch('config/get', null, { root: true }),
    ctx.dispatch('data/list', null, { root: true }),
  ])
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

  ctx.commit('setCtx', value)

  return ctx.state.ctx
}
