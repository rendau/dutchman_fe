export async function send (ctx, data) {
  return this.$api.post(`proxy_request`, data)
}
