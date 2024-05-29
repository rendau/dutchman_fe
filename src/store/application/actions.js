export function list(ctx) {
  let realm_id = ctx.rootState.realm.selected?.id
  if (!realm_id) {
    ctx.commit('setList', [])
    return
  }
  return this.$api.get('app', {params: {realm_id}}).then(resp => ctx.commit('setList', resp.data?.results || []))
}

export function get(ctx, id) {
  return this.$api.get(`app/${id}`)
}

export function create(ctx, data) {
  return this.$api.post('app', data).then(() => ctx.dispatch('list'))
}

export function update(ctx, {id, data}) {
  return this.$api.put(`app/${id}`, data).then(() => ctx.dispatch('list'))
}

export function remove(ctx, id) {
  if (!id) return
  return this.$api.delete(`app/${id}`).then(() => ctx.dispatch('list'))
}

export function duplicate(ctx, {id, data}) {
  if (!id) return
  return this.$api.post(`app/${id}/duplicate`, data).then(() => ctx.dispatch('list'))
}

export function sync_roles(ctx, id) {
  if (!id) return
  return this.$api.post(`app/${id}/sync_roles`)
}
