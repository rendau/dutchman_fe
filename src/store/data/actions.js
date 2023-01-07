export function list (ctx) {
  return this.$api.get('data')
}

export function get (ctx, id) {
  return this.$api.get(`data/${id}`)
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
