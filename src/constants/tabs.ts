/**
 * 标签页配置常量
 */
export const TABS_CONFIG = {
  /** 最大标签页数量 */
  MAX_TABS: 10,

  /** 加载进度条显示时长（毫秒） */
  LOADING_DELAY: 300,

  /** 排除标签页的路由 */
  EXCLUDED_ROUTES: ['/login', '/404'] as const,

  /** 始终保留的标签页路由 */
  ALWAYS_KEEP_ROUTE: '/analytics',
} as const

/** 标签页关闭操作的结果 */
export type CloseTabResult = string | null
