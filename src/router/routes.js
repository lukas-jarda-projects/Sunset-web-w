
const routes = [
  {
    path: '/:lang?',
    props: true,
    component: () => import('src/layouts/Layout.vue'),
    children: [
      { name: 'index', path: 'index', component: () => import('pages/Index.vue') },
      { name: 'about', path: 'about', component: () => import('pages/Public/AboutPage.vue') },
      { name: 'photo', path: 'photo', component: () => import('pages/Public/PhotoPage.vue') },
      { name: 'contact', path: 'contact', component: () => import('pages/Public/ContactPage.vue') }
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
