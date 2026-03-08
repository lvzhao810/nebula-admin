import type { RouteLocationNormalized } from 'vue-router'

export interface RouteMeta {
  title?: string
  permission?: string
  icon?: string
  hideInMenu?: boolean
  requiresAuth?: boolean
  keepAlive?: boolean
}

// 扩展 vue-router 的 RouteMeta 类型
declare module 'vue-router' {
  interface RouteMeta extends RouteMeta {}
}

export type TabRoute = Pick<RouteLocationNormalized, 'path' | 'meta'>
