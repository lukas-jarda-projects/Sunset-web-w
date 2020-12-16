
const routes = [
  {
    path: '/gekon/:lang?',
    props: true,
    component: () => import('src/gekon.cz/layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../gekon.cz/pages/IndexGekon') }
    ]
  },
  {
    path: '/jidelnasql/:lang?',
    props: true,
    component: () => import('src/jidelnasql.cz/layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../jidelnasql.cz/pages/IndexJidelna') }
    ]
  },
  {
    path: '/:lang?',
    props: true,
    component: () => import('src/dorsys.cz/layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('../dorsys.cz/pages/IndexDorsys') }
    ]
  }

]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
