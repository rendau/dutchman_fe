import _ from 'lodash'
import { util } from 'boot/util'
import { uid } from 'quasar'

export function list (ctx) {
  ctx.commit('addLoading')
  return this.$api.get('realm').then(resp => {
    let list = resp.data?.results || []
    ctx.commit('setList', list)
    if (!ctx.state.selected && list.length > 0) {
      return ctx.dispatch('select', list[0].id)
    }
  }).finally(() => ctx.commit('doneLoading'))
}

export function get (ctx, id) {
  ctx.commit('addLoading')
  return this.$api.get(`realm/${id}`).finally(() => ctx.commit('doneLoading'))
}

export function create (ctx, data) {
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

export function update (ctx, { id, data }) {
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

export function remove (ctx, id) {
  if (!id) return
  ctx.commit('addLoading')
  return this.$api.delete(`realm/${id}`).then(() => {
    if (ctx.state.selected?.id === id) {
      // unselect realm
      return ctx.dispatch('select', null)
    }
  }).then(() => ctx.dispatch('list')).finally(() => ctx.commit('doneLoading'))
}

export function refreshSelected (ctx) {
  return ctx.dispatch('select', ctx.state.selected?.id || null)
}

export function select (ctx, id) {
  ctx.commit('addLoading')
  let pr = id ? ctx.dispatch('get', id) : Promise.resolve()
  pr.then(resp => {
    return ctx.dispatch('setSelected', resp?.data || null)
  }).finally(() => ctx.commit('doneLoading'))
}

export function setSelected (ctx, data) {
  ctx.commit('setSelected', data || null)
}

export function deploy (ctx, data) {
  let id = ctx.state.selected?.id
  if (!id) return
  return this.$api.post(`realm/${id}/deploy`, data)
}

export function importConf (ctx, json) {
  let realm = ctx.state.selected
  if (!realm || !realm.val) {
    return ''
  }

  let data
  try {
    data = JSON.parse(json)
  } catch (err) {
    console.error(err)
    return Promise.reject('Invalid JSON')
  }

  let appMap = {}

  _.each(data.endpoints, ep => {
    let epPath = util.normalizePath(ep.endpoint)

    let be = _.head(ep.backend)
    if (!be) return
    if (_.lowerCase(be.method) !== _.lowerCase(ep.method)) return

    let bePath = util.normalizePath(be.url_pattern)

    let beHost = _.head(be.host)
    if (beHost && !_.startsWith(beHost, 'http')) {
      beHost = 'http://' + beHost
    }
    let beUrl = util.parseUrl(beHost)
    if (!beUrl) return
    if (util.normalizePath(beUrl.pathname)) {
      bePath = util.concatUrlPath(null, beUrl.pathname, bePath)
    }

    let [epPathPrefix, bePathPrefix, commonSuffix] = util.strTrimCommonSuffix(epPath, bePath)
    epPathPrefix = util.normalizePath(epPathPrefix)
    bePathPrefix = util.normalizePath(bePathPrefix)
    commonSuffix = util.normalizePath(commonSuffix)

    let appKey = `${beUrl.origin}__**${bePathPrefix}__**${epPathPrefix}`

    let app = appMap[appKey]
    if (app) {
      app.endpoints.push({
        path: commonSuffix,
        ep,
      })
    } else {
      appMap[appKey] = {
        epPathPrefix,
        bePathPrefix,
        beUrl: beUrl.origin,
        endpoints: [{
          path: commonSuffix,
          ep,
        }],
      }
    }
  })

  let apps = []

  _.each(appMap, app => {
    let eps = []

    _.each(app.endpoints, ep => {
      let ipCheckExpr = _.get(ep.ep, 'extra_config.validation/cel[0].check_expr')
      let ipValidationEnabled = false
      let allowedIps = []
      if (ipCheckExpr && _.startsWith(ipCheckExpr, `req_headers['X-Real-Ip'][0] in `)) {
        let ips = ipCheckExpr.slice(31).replaceAll(`'`, `"`)
        try {
          allowedIps = JSON.parse(ips)
          ipValidationEnabled = true
        } catch (err) {
          console.error(err)
        }
      }

      eps.push({
        id: uid(),
        active: true,
        method: ep.ep.method,
        path: ep.path,
        backend: {
          custom_path: false,
          path: '',
        },
        jwt_validation: {
          enabled: !!(ep.ep.extra_config?.['auth/validator']) || !!(ep.ep.extra_config?.['github.com/devopsfaith/krakend-jose/validator']),
          roles: [],
        },
        ip_validation: {
          enabled: ipValidationEnabled,
          allowed_ips: allowedIps,
        },
      })
    })

    apps.push({
      id: uid(),
      active: true,
      name: app.epPathPrefix || '---',
      path: app.epPathPrefix,
      backend_base: {
        host: app.beUrl,
        path: app.bePathPrefix,
      },
      endpoints: eps,
    })
  })

  let realmNewVal = _.assign({}, realm.val, { apps })
  return ctx.dispatch('update', { id: realm.id, data: { val: realmNewVal } })
}

export function generateConf (ctx) {
  let realm = ctx.state.selected?.val
  if (!realm) {
    return ''
  }

  let extraConfig = {}

  if (realm.general.cors_conf?.enabled) {
    extraConfig['security/cors'] = _.omitBy({
      'allow_origins': util.coalesceArray(realm.general.cors_conf.allow_origins),
      'allow_methods': util.coalesceArray(realm.general.cors_conf.allow_methods),
      'allow_headers': util.coalesceArray(realm.general.cors_conf.allow_headers),
      'expose_headers': '*',
      'allow_credentials': realm.general.cors_conf.allow_credentials || false,
      'max_age': realm.general.cors_conf.max_age || undefined,
    }, _.isUndefined)
  }

  let res = {
    '$schema': 'https://www.krakend.io/schema/v3.json',
    'version': 3,
    'timeout': realm.general.timeout,
    'read_header_timeout': realm.general.read_header_timeout,
    'read_timeout': realm.general.read_timeout,
    'endpoints': [],
  }

  if (_.keys(extraConfig).length > 0) {
    res['extra_config'] = extraConfig
  }

  let jwtConf = realm.general.jwt_conf || {}
  if (!jwtConf.jwk_url) {
    jwtConf = null
  }

  _.each(realm.apps, app => {
    if (!app.active) return

    _.each(app.endpoints, ep => {
      if (!ep.active) return

      let endpoint = {
        'endpoint': '/' + util.concatUrlPath(null, app.path, ep.path),
        'method': ep.method,
        'output_encoding': 'no-op',
        'input_query_strings': ['*'],
        'input_headers': ['*'],
        'backend': [
          {
            'url_pattern': '/' + util.concatUrlPath(null, app.backend_base.path, ep.backend.custom_path ? ep.backend.path : ep.path),
            'encoding': 'no-op',
            'method': ep.method,
            'host': [app.backend_base.host],
          },
        ],
      }

      let extraConfig = {}

      if (jwtConf && ep.jwt_validation?.enabled) {
        extraConfig['auth/validator'] = _.omitBy({
          'alg': jwtConf.alg,
          'jwk_url': jwtConf.jwk_url,
          'disable_jwk_security': jwtConf.disable_jwk_security,
          'cache': jwtConf.cache,
          'cache_duration': jwtConf.cache_duration,
          'roles': util.coalesceArray(ep.jwt_validation.roles),
          'roles_key': jwtConf.roles_key || undefined,
          'roles_key_is_nested': jwtConf.roles_key_is_nested || false,
        }, _.isUndefined)
      }

      if (ep.ip_validation?.enabled && (ep.ip_validation.allowed_ips || []).length) {
        let vCel = extraConfig['validation/cel'] || []
        vCel.push({
          'check_expr': `req_headers['X-Real-Ip'][0] in ['${ep.ip_validation.allowed_ips.join('\',\'')}']`,
        })
        extraConfig['validation/cel'] = vCel
      }

      if (_.keys(extraConfig).length > 0) {
        endpoint['extra_config'] = extraConfig
      }

      res['endpoints'].push(endpoint)
    })
  })

  return res
}
