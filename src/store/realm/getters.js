export function selected (state) {
  return state.selected
}

export function selectedId (state) {
  return state.selected?.id || ''
}

export function baseUrl (state) {
  return state.selected?.data.public_base_url
}

export function loading (state) {
  return state.loading > 0
}
