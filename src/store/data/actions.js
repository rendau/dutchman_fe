export function list (ctx) {
  ctx.commit('setLoading', true)
  return this.$api.get('data').then(resp => {
    ctx.commit('setRealms', resp.data?.results?.length || [])
  }).finally(() => {
    ctx.commit('setLoading', false)
  })
}

export function get (ctx, id) {
  ctx.commit('setLoading', true)
  return this.$api.get(`data/${id}`).finally(() => {
    ctx.commit('setLoading', false)
  })
}

export function create (ctx, data) {
  return this.$api.post('data', data)
}

export function update (ctx, { id, data }) {
  return this.$api.put(`data/${id}`, data)
}

export function remove (ctx, id) {
  return this.$api.delete(`data/${id}`)
}

export async function select (ctx, id) {
  if (!id) {
    ctx.commit('setSelectedRealm', null)
    return
  }
  return ctx.dispatch('get', id).then(resp => {
    ctx.commit('setSelectedRealm', resp.data || null)
  })
}
