export async function list (ctx) {
  ctx.commit('setLoading', true)
  return this.$api.get('data').then(resp => {
    ctx.commit('setRealms', resp.data?.results || [])
  }).finally(() => {
    ctx.commit('setLoading', false)
  })
}

export async function get (ctx, id) {
  ctx.commit('setLoading', true)
  return this.$api.get(`data/${id}`).then(resp => {
    ctx.commit('setSelectedRealm', resp.data || null)
  }).finally(() => {
    ctx.commit('setLoading', false)
  })
}

export async function create (ctx, data) {
  return this.$api.post('data', data).then(() => ctx.dispatch('list'))
}

export async function update (ctx, { id, data }) {
  return this.$api.put(`data/${id}`, data).then(() => {
    return ctx.dispatch('list').then(() => {
      if (ctx.state.selectedRealm?.id === id) {
        return ctx.dispatch('get', id)
      }
    })
  })
}

export async function remove (ctx, id) {
  return this.$api.delete(`data/${id}`).then(() => {
    return ctx.dispatch('list').then(() => {
      if (ctx.state.selectedRealm?.id === id) {
        if (ctx.state.realms.length > 0) {
          return ctx.dispatch('select', ctx.state.realms[0].id)
        } else {
          return ctx.dispatch('select', null)
        }
      }
    })
  })
}

export async function select (ctx, id) {
  if (!id) {
    ctx.commit('setSelectedRealm', null)
    return
  }
  return ctx.dispatch('get', id)
}
