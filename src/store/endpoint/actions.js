export function list (ctx, params) {
  return this.$api.get('endpoint', { params })
}

export function get (ctx, id) {
  return this.$api.get(`endpoint/${id}`)
}

export function create (ctx, data) {
  return this.$api.post('endpoint', data)
}

export function update (ctx, { id, data }) {
  return this.$api.put(`endpoint/${id}`, data)
}

export function remove (ctx, id) {
  return this.$api.delete(`endpoint/${id}`)
}
