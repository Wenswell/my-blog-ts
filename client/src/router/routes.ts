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
    component: () => import('@/views/dash/dash-login.vue'),
  },

  {
    path: '/dash',
    name: 'Dashbord',
    redirect: '/dash/home',
    component: () => import('@/views/dash/index.vue'),
    children: [
      {
        path: 'home',
        name: 'Dhome',
        component: () => import('@/views/dash/dash-home.vue'),
      },
      {
        path: 'articles',
        name: 'Darticles',
        component: () => import('@/views/dash/dash-articles.vue'),
      },
      {
        path: 'writing',
        name: 'DWriting',
        component: () => import('@/views/dash/dash-writing.vue'),
      },
      {
        path: 'editing/:id',
        name: 'DEditing',
        component: () => import('@/views/dash/dash-editing.vue'),
      },
      {
        path: 'categories',
        name: 'Dcategories',
        component: () => import('@/views/dash/dash-categories.vue'),
      },
      {
        path: 'tags',
        name: 'Dtags',
        component: () => import('@/views/dash/dash-tags.vue'),
      },
      {
        path: 'account',
        name: 'Daccount',
        component: () => import('@/views/dash/dash-account.vue'),
      },
    ],
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
