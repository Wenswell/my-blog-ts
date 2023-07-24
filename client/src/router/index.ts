//通过vue-router插件实现模板路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'
//创建路由器
const router = createRouter({
  //路由模式hash
  history: createWebHashHistory(),
  routes: constantRoutes,
  //滚动行为
  // scrollBehavior() {
  //   return {
  //     left: 0,
  //     top: 0,
  //   }
  // },
})
router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  window.history.scrollRestoration = 'auto'
  if (to.params) {
    Object.keys(to.params).forEach((key) => {
      const value = to.params[key] as string
      to.params[key] = encodeURIComponent(value)
    })
  }
  if (to.name !== from.name) {
    // 设置滚动条在顶部
    window.scrollTo(0, 0)
  }
  next()
})
export default router
