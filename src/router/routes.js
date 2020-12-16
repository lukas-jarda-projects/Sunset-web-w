
const routes = [
  {
    path: '/:lang?',
    props: true,
    component: () => import('src/layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexJidelna') }
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
