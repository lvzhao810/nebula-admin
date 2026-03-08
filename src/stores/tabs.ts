import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Modal } from 'ant-design-vue'
import type { TabRoute } from '@/types/router'
import { TABS_CONFIG } from '@/constants/tabs'

export interface Tab {
  key: string
  title: string
  path: string
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([])
  const activeKey = ref<string>('')
  const visible = ref(true)

  // 添加或切换到标签
  function addTab(route: TabRoute) {
    const { path } = route

    // 排除特定路由
    if (TABS_CONFIG.EXCLUDED_ROUTES.some(r => path.startsWith(r))) {
      return
    }

    const title = getRouteTitle(route)

    // 检查标签是否已存在
    const existingIndex = tabs.value.findIndex(t => t.key === path)

    if (existingIndex !== -1) {
      // 标签已存在，切换到该标签（不改变位置）
      setActiveTab(path)
    } else {
      // 新标签，检查数量限制
      if (tabs.value.length >= TABS_CONFIG.MAX_TABS) {
        // 移除最久未使用的标签（第一个），但保留 Dashboard
        const dashboardIndex = tabs.value.findIndex(t => t.key === TABS_CONFIG.ALWAYS_KEEP_ROUTE)
        if (dashboardIndex === 0) {
          tabs.value.shift()
        } else {
          tabs.value.splice(dashboardIndex > 0 ? dashboardIndex : 0, 1)
          tabs.value.unshift({ key: TABS_CONFIG.ALWAYS_KEEP_ROUTE, title: '仪表盘', path: TABS_CONFIG.ALWAYS_KEEP_ROUTE })
        }
      }

      // 添加新标签
      tabs.value.push({
        key: path,
        title,
        path,
      })

      setActiveTab(path)
    }
  }

  // 关闭标签
  function closeTab(key: string) {
    const currentIndex = tabs.value.findIndex(t => t.key === key)

    if (currentIndex === -1) return

    tabs.value.splice(currentIndex, 1)

    // 如果关闭的是当前激活的标签
    if (key === activeKey.value) {
      if (tabs.value.length > 0) {
        // 优先跳转到右侧相邻标签，如果没有则跳转到左侧
        const nextTab = tabs.value[currentIndex] || tabs.value[currentIndex - 1]
        if (nextTab) {
          setActiveTab(nextTab.key)
          return nextTab.key
        }
      }
      // 没有标签了，返回首页
      return TABS_CONFIG.ALWAYS_KEEP_ROUTE
    }

    return activeKey.value
  }

  // 设置激活标签
  function setActiveTab(key: string) {
    activeKey.value = key
  }

  // 关闭其他标签
  function closeOtherTabs(currentKey: string) {
    tabs.value = tabs.value.filter(t => t.key === currentKey)
    setActiveTab(currentKey)
  }

  // 关闭所有标签
  function closeAllTabs() {
    tabs.value = []
    activeKey.value = ''
  }

  // 切换标签栏显示/隐藏
  async function toggleVisible() {
    // 如果当前是打开状态，需要关闭时询问用户
    if (visible.value) {
      // 只有一个标签时，直接关闭并清空，不弹窗
      if (tabs.value.length <= 1) {
        closeAllTabs()
        visible.value = false
        return
      }

      // 多个标签时，询问用户是否保留
      return new Promise<void>((resolve) => {
        Modal.confirm({
          title: '关闭标签栏',
          content: '是否保留已打开的标签数据？',
          okText: '保留标签',
          cancelText: '清空标签',
          okType: 'default',
          onOk: () => {
            visible.value = false
            resolve()
          },
          onCancel: () => {
            closeAllTabs()
            visible.value = false
            resolve()
          },
        })
      })
    } else {
      // 从关闭状态打开，直接切换
      visible.value = true
    }
  }

  // 设置标签栏显示状态（直接设置，不询问）
  function setVisible(value: boolean) {
    if (!value) {
      // 关闭时清空所有标签
      closeAllTabs()
    }
    visible.value = value
  }

  // 获取路由标题
  function getRouteTitle(route: TabRoute): string {
    if (route.meta?.title) {
      return route.meta.title as string
    }

    // 从路由路径中提取标题
    const pathSegments = route.path.split('/').filter(Boolean)

    if (pathSegments.length === 0) return '首页'

    // 驼峰命名转标题
    const lastSegment = pathSegments[pathSegments.length - 1]
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return {
    tabs,
    activeKey,
    visible,
    addTab,
    closeTab,
    setActiveTab,
    closeOtherTabs,
    closeAllTabs,
    toggleVisible,
    setVisible,
  }
})
