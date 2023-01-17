import _ from 'lodash'

export function selectedRealm (state) {
  return state.selectedRealm
}

export function selectedRealmBaseUrl (state) {
  return state.selectedRealm?.val.general.public_base_url
}

export function selectedRealmApps (state) {
  return _.sortBy(state.selectedRealm?.val?.apps || [], 'name')
}
