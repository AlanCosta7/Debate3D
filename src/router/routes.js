
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '/index', component: () => import('pages/index') },
      { path: '', component: () => import('pages/user/login') },
      { path: '/debate', component: () => import('pages/debate') },
      { path: '/mydebates', component: () => import('pages/mydebates') },
      { path: '/profile', component: () => import('pages/user/profile') },
      { path: '/cadastro', component: () => import('pages/user/cadastro') },
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
