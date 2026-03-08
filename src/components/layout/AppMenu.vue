<template>
  <div class="custom-menu">
    <div
      v-for="item in menuList"
      :key="item.path"
      class="menu-item-wrapper"
    >
      <!-- 有子菜单的情况 -->
      <template v-if="item.children && item.children.length > 0">
        <div
          class="menu-item menu-item-has-children"
          :class="{ 'menu-item-open': openKeys.includes(item.path) }"
          @click="toggleSubMenu(item.path)"
        >
          <div class="menu-item-content">
            <component :is="getIconComponent(item.meta?.icon)" class="menu-icon" />
            <span class="menu-title">{{ item.meta?.title }}</span>
            <span class="menu-arrow" :class="{ 'menu-arrow-open': openKeys.includes(item.path) }">
              <DownOutlined />
            </span>
          </div>
        </div>
        <div v-show="openKeys.includes(item.path)" class="sub-menu">
          <div
            v-for="child in item.children"
            :key="child.path"
            class="sub-menu-item"
            :class="{ 'sub-menu-item-active': isActiveChild(child.path) }"
            @click="handleMenuClick(child)"
          >
            <component :is="getIconComponent(child.meta?.icon)" class="menu-icon" />
            <span class="menu-title">{{ child.meta?.title }}</span>
          </div>
        </div>
      </template>

      <!-- 无子菜单的情况 -->
      <template v-else>
        <div
          class="menu-item"
          :class="{ 'menu-item-active': selectedKeys.includes(item.path) }"
          @click="handleMenuClick(item)"
        >
          <div class="menu-item-content">
            <component :is="getIconComponent(item.meta?.icon)" class="menu-icon" />
            <span class="menu-title">{{ item.meta?.title }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DownOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import { iconMap } from '@/utils/icons'

const router = useRouter()
const route = useRoute()

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

function isValidMenuItem(routeRecord: any): boolean {
  // Exclude root route
  if (routeRecord.path === '/') return false

  // Check required metadata
  if (!routeRecord.meta?.title) return false
  if (routeRecord.meta?.hideInMenu) return false
  if (!routeRecord.meta?.requiresAuth) return false

  // Exclude special routes
  if (routeRecord.path === '/login' || routeRecord.path.includes('*')) return false

  // Only top-level menu items (single path segment)
  const segments = routeRecord.path.split('/').filter(Boolean)
  return segments.length === 1
}

function getChildRoutes(parentRoute: any, allRoutes: any[]): any[] {
  return allRoutes.filter((r) => {
    if (!r.path.startsWith(parentRoute.path + '/')) return false
    if (r.meta?.hideInMenu) return false
    if (!r.meta?.requiresAuth) return false
    if (!r.meta?.title) return false
    return true
  })
}

const menuList = computed(() => {
  const routes = router.getRoutes()
  const validMenuItems = routes.filter(isValidMenuItem)

  return validMenuItems.map((parentRoute) => ({
    ...parentRoute,
    children: getChildRoutes(parentRoute, routes),
  }))
})

function getIconComponent(iconName?: string) {
  if (!iconName) return h(AppstoreOutlined)

  const Icon = iconMap[iconName]

  // Fallback icons for names that might not exist
  if (!Icon) {
    const fallbackMap: Record<string, any> = {
      DragOutlined: AppstoreOutlined,
      InteractionOutlined: AppstoreOutlined,
    }
    return h(fallbackMap[iconName] || AppstoreOutlined)
  }

  return h(Icon)
}

function toggleSubMenu(path: string): void {
  const index = openKeys.value.indexOf(path)
  if (index > -1) {
    openKeys.value.splice(index, 1)
  } else {
    openKeys.value.push(path)
  }
}

function handleMenuClick(item: any): void {
  router.push(item.path)
}

// 判断子菜单是否激活（处理 /index 重定向的情况）
function isActiveChild(childPath: string): boolean {
  const currentPath = selectedKeys.value[0] || ''
  // 直接匹配或者匹配带 /index 的路径
  return currentPath === childPath || currentPath === `${childPath}/index`
}

watch(
  () => route.path,
  (newPath) => {
    // 移除 /index 后缀，因为有些路由会重定向到带 /index 的路径
    const normalizedPath = newPath.replace(/\/index$/, '')
    selectedKeys.value = [normalizedPath]

    const pathSegments = normalizedPath.split('/').filter(Boolean)
    if (pathSegments.length > 1) {
      openKeys.value = [`/${pathSegments[0]}`]
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="less">
.custom-menu {
  padding: 8px 0;
  overflow-y: auto;
  overflow-x: hidden;

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.menu-item-wrapper {
  margin-bottom: 4px;
}

/* 主菜单项 - 亮色模式（渐变背景） */
.menu-item {
  position: relative;
  margin: 0 12px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: translateX(4px);
  }

  &.menu-item-active {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: #ffffff;
      border-radius: 0 3px 3px 0;
    }
  }

  &.menu-item-has-children {
    .menu-arrow {
      margin-left: auto;
      font-size: 12px;
      transition: transform 0.3s ease;

      &.menu-arrow-open {
        transform: rotate(180deg);
      }
    }
  }
}

/* 暗色模式 - 菜单项样式优化 */
.dark .menu-item {
  color: var(--text-secondary);

  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
    transform: translateX(2px);
  }

  &.menu-item-active {
    background: var(--hover-bg-active);
    color: var(--text-primary);
    font-weight: 600;

    &::before {
      background: var(--theme-primary);
      opacity: 0.8;
    }
  }
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.9;
}

.menu-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 子菜单 */
.sub-menu {
  margin-top: 4px;
  padding-left: 12px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sub-menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 12px;
  margin-bottom: 4px;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
  }

  &.sub-menu-item-active {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: #ffffff;
      border-radius: 0 3px 3px 0;
    }
  }
}

/* 暗色模式 - 子菜单项样式优化 */
.dark .sub-menu-item {
  color: var(--text-tertiary);

  &:hover {
    background: var(--hover-bg);
    color: var(--text-secondary);
  }

  &.sub-menu-item-active {
    background: var(--hover-bg-active);
    color: var(--text-primary);
    font-weight: 600;

    &::before {
      background: var(--theme-primary);
      opacity: 0.8;
      width: 3px;
      height: 60%;
      border-radius: 0 3px 3px 0;
    }
  }
}
</style>
