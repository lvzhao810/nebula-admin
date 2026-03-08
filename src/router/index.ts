import { createRouter, createWebHashHistory } from 'vue-router'
import { routes, NOT_FOUND_ROUTE } from './routes'
import { setupRouterGuard } from './guards'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...routes, NOT_FOUND_ROUTE],
  scrollBehavior: () => ({ top: 0 }),
})

// 设置路由守卫
setupRouterGuard(router)

export default router
