export async function list (ctx) {
  ctx.commit('setLoading', true)
  return this.$api.get('data').then(resp => {
    let realms = resp.data?.results || []
    let selectedRealm = ctx.state.selectedRealm
    ctx.commit('setRealms', realms)
    if (!selectedRealm || !_.find(realms, { id: selectedRealm.id })) {
      if (realms.length > 0) {
        return ctx.dispatch('select', realms[0].id)
      } else {
        return ctx.dispatch('select', null)
      }
    }
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
  return this.$api.post('data', data).then(createResp => {
    return ctx.dispatch('list').then(() => {
      if (createResp.data?.id) {
        return ctx.dispatch('select', createResp.data.id)
      }
    })
  })
}

export async function update (ctx, { id, data }) {
  return this.$api.put(`data/${id}`, data).then(() => {
    return ctx.dispatch('list').then(() => {
      // refresh
      if (ctx.state.selectedRealm?.id === id) {
        return ctx.dispatch('get', id)
      }
    })
  })
}

export async function remove (ctx, id) {
  return this.$api.delete(`data/${id}`).then(() => ctx.dispatch('list'))
}

export async function select (ctx, id) {
  if (!id) {
    ctx.commit('setSelectedRealm', null)
    return
  }
  return ctx.dispatch('get', id)
}
