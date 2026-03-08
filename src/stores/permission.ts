import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from './user'

interface PermissionState {
  routes: RouteRecordRaw[]
}

const asyncRoutes: RouteRecordRaw[] = []

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
  }),

  actions: {
    async generateRoutes(): Promise<RouteRecordRaw[]> {
      const userStore = useUserStore()
      const accessedRoutes = filterRoutes(asyncRoutes, userStore.permissions)
      this.routes = accessedRoutes
      return accessedRoutes
    },

    clearRoutes(): void {
      this.routes = []
    },
  },
})

function filterRoutes(routes: RouteRecordRaw[], permissions: string[]): RouteRecordRaw[] {
  return routes.reduce((acc: RouteRecordRaw[], route) => {
    if (hasPermission(route, permissions)) {
      const filteredRoute = { ...route }
      if (filteredRoute.children) {
        filteredRoute.children = filterRoutes(filteredRoute.children, permissions)
      }
      acc.push(filteredRoute)
    }
    return acc
  }, [])
}

function hasPermission(route: RouteRecordRaw, permissions: string[]): boolean {
  // Public routes
  if (route.meta?.requiresAuth === false) {
    return true
  }

  // Routes without permission requirements
  if (!route.meta?.permission) {
    return true
  }

  // Check route permissions
  const routePermission = route.meta.permission as string | string[]
  if (Array.isArray(routePermission)) {
    return routePermission.some((p) => permissions.includes(p))
  }
  return permissions.includes(routePermission)
}
