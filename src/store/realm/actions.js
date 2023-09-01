import _ from 'lodash'
import {util} from 'boot/util'
import {uid} from 'quasar'

export function list(ctx) {
  ctx.commit('addLoading')
  return this.$api.get('realm').then(resp => {
    let list = resp.data?.results || []
    ctx.commit('setList', list)
    if (!ctx.state.selected && list.length > 0) {
      return ctx.dispatch('select', list[0].id)
    }
  }).finally(() => ctx.commit('doneLoading'))
}

export function get(ctx, id) {
  ctx.commit('addLoading')
  return this.$api.get(`realm/${id}`).finally(() => ctx.commit('doneLoading'))
}

export function create(ctx, data) {
  ctx.commit('addLoading')
  return this.$api.post('realm', data).then(createResp => {
    return ctx.dispatch('list').then(() => {
      if (createResp.data?.id) {
        // select new realm
        return ctx.dispatch('select', createResp.data.id)
      }
    })
  }).finally(() => ctx.commit('doneLoading'))
}

export function update(ctx, {id, data}) {
  ctx.commit('addLoading')
  return this.$api.put(`realm/${id}`, data).then(() => {
    return ctx.dispatch('list').then(() => {
      if (ctx.state.selected?.id === id) {
        // refresh selected realm
        return ctx.dispatch('refreshSelected')
      }
    })
  }).finally(() => ctx.commit('doneLoading'))
}

export function remove(ctx, id) {
  if (!id) return
  ctx.commit('addLoading')
  return this.$api.delete(`realm/${id}`).then(() => {
    if (ctx.state.selected?.id === id) {
      // unselect realm
      return ctx.dispatch('select', null)
    }
  }).then(() => ctx.dispatch('list')).finally(() => ctx.commit('doneLoading'))
}

export function previewConf(ctx, id) {
  return this.$api.get(`realm/${id}/preview_conf`)
}

export function deploy(ctx, id) {
  return this.$api.post(`realm/${id}/deploy`)
}

export function importConf(ctx, {id, data}) {
  return this.$api.post(`realm/${id}/import_conf`, data).then(resp => {
    return ctx.dispatch('refreshSelected').then(() => resp)
  })
}

export function refreshSelected(ctx) {
  return ctx.dispatch('select', ctx.state.selected?.id || null)
}

export function select(ctx, id) {
  ctx.commit('addLoading')
  let pr = id ? ctx.dispatch('get', id) : Promise.resolve()
  pr.then(resp => {
    return ctx.dispatch('setSelected', resp?.data || null)
  }).finally(() => ctx.commit('doneLoading'))
}

export function setSelected(ctx, data) {
  ctx.commit('setSelected', data || null)
  return ctx.dispatch('application/list', null, {root: true})
}
