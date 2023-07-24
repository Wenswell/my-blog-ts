export const constantRoutes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/home/index.vue'),
  // },
  {
    path: '/',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },

  {
    path: '/articles',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: '',
        name: 'ArticleList',
        component: () => import('@/views/articles/index.vue'),
      },
      {
        path: ':id',
        name: 'ArticleDetail',
        component: () => import('@/views/articles/detail.vue'),
      },
    ],
  },

  {
    path: '/tags',
    redirect: '/tags/AWS',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: ':tagName',
        name: 'TagList',
        component: () => import('@/views/tags/index.vue'),
      },
    ],
  },

  {
    path: '/categories',
    redirect: '/categories/无',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: ':categoryName',
        name: 'CategoryList',
        component: () => import('@/views/categories/index.vue'),
      },
    ],
  },

  {
    path: '/about',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: '',
        name: 'About',
        component: () => import('@/views/about/index.vue'),
      },
    ],
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/dash/login.vue'),
  },

  {
    path: '/dash',
    name: 'Dashbord',
    component: () => import('@/views/dash/index.vue'),
  },

  // { path: '/about', name: 'About', component: () => import('@/views/about/index.vue') },

  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/test/index.vue'),
  // },

  {
    path: '/test',
    name: 'NotFound',
    component: () => import('@/views/test/index.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/test' },
]
