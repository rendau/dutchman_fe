function formatRoutes (routes, idPrefix, lvl) {
  if (!routes || !routes.length) return
  let i, r
  for (i = 0; i < routes.length; i++) {
    r = routes[i]
    r.props = r.props || {}
    r.props.rid = idPrefix + (idPrefix && '_') + (i + 1)
    r.props.zi = 2500 + lvl
    r.meta = r.meta || {}
    r.meta.rid = r.props.rid
    formatRoutes(r.children, r.props.rid, lvl + 1)
  }
}

const routes = [
  {
    path: '/auth',
    component: () => import('layouts/EmptyLayout.vue'),
    meta: {
      restrictAuth: true,
    },
    children: [
      { path: '', name: 'auth', component: () => import('pages/Auth.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      { path: 'realm/create', name: 'realm-create', component: () => import('pages/RealmE.vue') },
      { path: 'realm/edit', name: 'realm-edit', component: () => import('pages/RealmE.vue'), props: { mode: 'edit' } },
      { path: 'app/create', name: 'app-create', component: () => import('pages/AppC.vue') },
      { path: 'app/:id', name: 'app', component: () => import('pages/App.vue') },
      { path: '', component: () => import('pages/Index.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    redirect: '/',
  },
]

formatRoutes(routes, '', 1)

export default routes
