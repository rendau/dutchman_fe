import _ from 'lodash'

export function selectedRealm (state) {
  return state.selectedRealm
}

export function selectedRealmApps (state) {
  return _.sortBy(state.selectedRealm?.val?.apps || [], 'name')
}
