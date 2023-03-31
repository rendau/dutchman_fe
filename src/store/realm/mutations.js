export function setList (state, v) {
  state.list = v
}

export function setSelected (state, v) {
  state.selected = v
}

export function addLoading (state) {
  state.loading++
}

export function doneLoading (state) {
  state.loading--
  if (state.loading < 0) {
    state.loading = 0
  }
}
