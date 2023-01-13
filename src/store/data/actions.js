export async function list (ctx) {
  ctx.commit('setLoading', true)
  return this.$api.get('data').then(resp => {
    let realms = resp.data?.results || []
    ctx.commit('setRealms', realms)
    if (!ctx.state.selectedRealm && realms.length > 0) {
      return ctx.dispatch('select', realms[0].id)
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
    ctx.dispatch('list').then(() => {
      if (createResp.data?.id) {
        return ctx.dispatch('select', createResp.data?.id)
      }
    })
  })
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
