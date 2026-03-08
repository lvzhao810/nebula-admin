<template>
  <div class="app-header">
    <div class="header-left">
      <MenuUnfoldOutlined
        v-if="!collapsed"
        class="header-icon"
        @click="toggleCollapse"
      />
      <MenuFoldOutlined
        v-else
        class="header-icon"
        @click="toggleCollapse"
      />
      <TagsOutlined
        class="header-icon"
        :class="{ active: tabsVisible }"
        @click="toggleTabs"
        title="切换标签栏"
      />
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          {{ item.title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="header-right">
      <!-- 搜索 -->
      <a-input-search
        placeholder="搜索..."
        class="search-input hidden sm:block"
      />

      <!-- 通知 -->
      <a-badge :count="3" :offset="[-5, 5]">
        <BellOutlined class="header-icon" />
      </a-badge>

      <!-- 主题切换器 -->
      <ThemeSwitcher />

      <!-- 用户信息 -->
      <a-dropdown>
        <div class="user-info">
          <a-avatar :size="32" class="user-avatar">
            {{ userStore.userInfo?.username?.charAt(0).toUpperCase() || 'A' }}
          </a-avatar>
          <span class="user-name hidden md:inline">
            {{ userStore.userInfo?.username || 'Admin' }}
          </span>
          <DownOutlined class="dropdown-arrow" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleProfile">
              <UserOutlined class="mr-2" />
              个人中心
            </a-menu-item>
            <a-menu-item @click="handleSettings">
              <SettingOutlined class="mr-2" />
              系统设置
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="handleLogout">
              <LogoutOutlined class="mr-2 text-red-500" />
              <span class="text-red-500">退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTabsStore } from '@/stores/tabs'
import { Modal } from 'ant-design-vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  TagsOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons-vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const tabsStore = useTabsStore()

// 标签栏显示状态
const tabsVisible = computed(() => tabsStore.visible)

// 切换标签栏显示
const toggleTabs = () => {
  tabsStore.toggleVisible()
}

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}

// 面包屑列表
const breadcrumbList = computed(() => {
  const matched = route.matched.filter((r) => r.meta?.title)
  return matched.map((r) => ({
    path: r.path,
    title: r.meta?.title as string,
  }))
})

// 个人中心
const handleProfile = () => {
  router.push('/profile')
}

// 系统设置
const handleSettings = () => {
  router.push('/settings')
}

// 退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      await userStore.logout()
      router.push('/login')
    },
  })
}
</script>

<style scoped lang="less">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon {
  font-size: 18px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    color: var(--theme-primary);
    background: var(--hover-bg);
  }

  &.active {
    color: var(--theme-primary);
    background: rgba(99, 102, 241, 0.1);
  }
}

.breadcrumb {
  :deep(.ant-breadcrumb-link) {
    color: var(--text-secondary);
    font-size: 14px;

    &:hover {
      color: var(--theme-primary);
    }
  }

  :deep(.ant-breadcrumb-separator) {
    color: var(--text-secondary);
  }
}

.search-input {
  width: 200px;

  :deep(.ant-input) {
    border-radius: 8px;
    background: var(--hover-bg);
    border-color: var(--border-color);
    color: var(--text-primary);

    &::placeholder {
      color: var(--text-secondary);
    }

    &:hover {
      border-color: var(--theme-primary);
    }

    &:focus {
      border-color: var(--theme-primary);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--hover-bg);
  }
}

.user-avatar {
  background: var(--theme-gradient) !important;
  color: #ffffff;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-arrow {
  transform: rotate(180deg);
}
</style>
