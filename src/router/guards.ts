import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { message } from 'ant-design-vue'

const WHITE_LIST = ['/login', '/404', '/403']

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const token = userStore.token

    // Redirect to login if no token
    if (!token) {
      if (WHITE_LIST.includes(to.path)) {
        return next()
      }
      return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }

    // Redirect to dashboard if already logged in
    if (to.path === '/login') {
      return next({ path: '/dashboard' })
    }

    // If user info exists, proceed
    if (userStore.userInfo?.id) {
      if (to.matched.length === 0) {
        return next('/404')
      }
      return next()
    }

    // Fetch user info and generate routes
    try {
      await userStore.getUserInfo()
      const accessRoutes = await permissionStore.generateRoutes()
      accessRoutes.forEach((route) => router.addRoute(route))
      return next()
    } catch (error) {
      await userStore.logout()
      message.error('获取用户信息失败，请重新登录')
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  })

  router.afterEach((to) => {
    const title = to.meta?.title
    document.title = title ? `${title} - Nebula Admin` : 'Nebula Admin'
  })
}
