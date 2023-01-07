export function list (ctx) {
  ctx.commit('setLoading', true)
  return this.$api.get('data').finally(() => {
    ctx.commit('setLoading', false)
  })
}

export function get (ctx, id) {
  ctx.commit('setLoading', true)
  return this.$api.get(`data/${id}`).then(resp => {
    ctx.commit('setSelectedRealm', resp.data || null)
  }).finally(() => {
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
  if (id) {
    return ctx.dispatch('get', id)
  }
  ctx.commit('setSelected', null)
}
