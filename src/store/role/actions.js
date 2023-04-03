export function list (ctx, params) {
  return this.$api.get('role', { params })
}

export function get (ctx, id) {
  return this.$api.get(`role/${id}`)
}

export function create (ctx, data) {
  return this.$api.post('role', data)
}

export function update (ctx, { id, data }) {
  return this.$api.put(`role/${id}`, data)
}

export function remove (ctx, id) {
  return this.$api.delete(`role/${id}`)
}
