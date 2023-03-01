import _ from 'lodash'
import { util } from 'boot/util'
import { uid } from 'quasar'

export async function list (ctx) {
  ctx.commit('setLoading', true)
  return this.$api.get('data').then(resp => {
    let realms = resp.data?.results || []
    let selectedRealm = ctx.state.selectedRealm
    ctx.commit('setRealms', realms)
    if (!selectedRealm || !_.find(realms, { id: selectedRealm.id })) {
      if (realms.length > 0) {
        return ctx.dispatch('select', realms[0].id)
      } else {
        return ctx.dispatch('select', null)
      }
    }
  }).finally(() => {
    ctx.commit('setLoading', false)
  })
}

export async function get (ctx, id) {
  ctx.commit('setLoading', true)
  return this.$api.get(`data/${id}`).then(resp => {
    ctx.commit('setSelectedRealm', resp.data || null)
  }).finally(() => {
    ctx.commit('setLoading', false)
  })
}

export async function create (ctx, data) {
  return this.$api.post('data', data).then(createResp => {
    return ctx.dispatch('list').then(() => {
      if (createResp.data?.id) {
        return ctx.dispatch('select', createResp.data.id)
      }
    })
  })
}

export async function update (ctx, { id, data }) {
  return this.$api.put(`data/${id}`, data).then(() => {
    return ctx.dispatch('list').then(() => {
      // refresh
      if (ctx.state.selectedRealm?.id === id) {
        return ctx.dispatch('get', id)
      }
    })
  })
}

export async function remove (ctx, id) {
  return this.$api.delete(`data/${id}`).then(() => ctx.dispatch('list'))
}

export async function select (ctx, id) {
  if (!id) {
    ctx.commit('setSelectedRealm', null)
    return
  }
  return ctx.dispatch('get', id)
}

export async function deploy (ctx, data) {
  return this.$api.post('data/deploy', data)
}

export async function importConf (ctx, json) {
  let realm = ctx.state.selectedRealm
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

    let beUrl = util.parseUrl(_.head(be.host))
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

  _.each(appMap, obj => {
    apps.push({
      id: uid(),
      active: true,
      name: obj.epPathPrefix || '---',
      path: obj.epPathPrefix,
      backend_base: {
        host: obj.beUrl,
        path: obj.bePathPrefix,
      },
      endpoints: [],
    })
  })

  let realmNewVal = _.assign({}, realm.val, { apps })
  return ctx.dispatch('update', { id: realm.id, data: { val: realmNewVal } })
}

export async function generateConf (ctx) {
  let realm = ctx.state.selectedRealm?.val
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
