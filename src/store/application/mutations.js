export function setChanges (state) {
  if (state.changes > 10) {
    state.changes = 0
  } else {
    state.changes++
  }
}
