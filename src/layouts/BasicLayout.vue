<template>
  <div class="basic-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="!overflow-hidden sider-themed"
    >
      <div class="h-56 flex items-center justify-center logo-container">
        <div v-if="!collapsed" class="flex items-center gap-3">
          <div class="logo-icon w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--theme-gradient)">
            <span class="text-white font-bold text-lg">N</span>
          </div>
          <span class="logo-text text-white text-xl font-bold tracking-wide">Nebula Admin</span>
        </div>
        <div v-else class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--theme-gradient)">
          <span class="text-white font-bold text-lg">N</span>
        </div>
      </div>
      <AppMenu />
    </a-layout-sider>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <AppHeader v-model:collapsed="collapsed" />

      <!-- 多标签栏 -->
      <Transition name="tabs-slide">
        <TabsView v-if="tabsVisible" />
      </Transition>

      <!-- 顶部进度条 -->
      <div class="page-loading-bar" :class="{ active: isLoading }">
        <div class="loading-bar-fill"></div>
      </div>

      <!-- 内容区域 -->
      <a-layout-content class="content-area">
        <div ref="scrollContainer" class="scroll-container">
          <router-view v-slot="{ Component }">
            <component :is="Component" :key="route.path" />
          </router-view>
        </div>
      </a-layout-content>
    </div>

    <!-- AI 助手 -->
    <AiAssistant />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppMenu from '@/components/layout/AppMenu.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import TabsView from '@/components/layout/TabsView.vue'
import AiAssistant from '@/components/ai/AiAssistant.vue'
import { useTabsStore } from '@/stores/tabs'
import { TABS_CONFIG } from '@/constants/tabs'

const collapsed = ref(false)
const tabsStore = useTabsStore()
const tabsVisible = computed(() => tabsStore.visible)
const route = useRoute()
const scrollContainer = ref<HTMLElement>()
const isLoading = ref(false)

let loadingTimer: number | null = null

// 监听路由变化，显示进度条
watch(() => route.path, () => {
  // 重置滚动位置到顶部
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }

  // 清除之前的定时器
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  // 显示加载进度条
  isLoading.value = true

  // 模拟加载完成
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
    loadingTimer = null
  }, TABS_CONFIG.LOADING_DELAY)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
})
</script>

<style scoped lang="less">
.basic-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.content-area {
  flex: 1;
  min-height: 0;
  background: var(--bg-secondary);
}

.scroll-container {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 页面加载进度条 */
.page-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.page-loading-bar.active {
  opacity: 1;
}

.loading-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
  width: 0%;
  transition: width 0.3s ease;
}

.page-loading-bar.active .loading-bar-fill {
  width: 80%;
  animation: loading-progress 0.3s ease forwards;
}

@keyframes loading-progress {
  0% {
    width: 0%;
  }
  50% {
    width: 60%;
  }
  100% {
    width: 100%;
  }
}

.logo-container {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 标签栏过渡动画 */
.tabs-slide-enter-active {
  transition: all 0.2s ease-out;
}

.tabs-slide-leave-active {
  transition: all 0.15s ease-in;
}

.tabs-slide-enter-from,
.tabs-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.tabs-slide-enter-to,
.tabs-slide-leave-from {
  opacity: 1;
  max-height: 60px;
  transform: translateY(0);
}

/* 亮色模式 - 侧边栏使用主题渐变 */
.sider-themed {
  background: var(--theme-gradient) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

:deep(.ant-layout-sider) {
  background: var(--theme-gradient) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
}

:deep(.ant-layout-sider-collapsed) {
  background: var(--theme-gradient) !important;
}

:deep(.ant-layout-sider-trigger) {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.ant-layout-sider-trigger:hover) {
  background: rgba(255, 255, 255, 0.25);
}

/* 暗色模式 - 使用深色背景，更协调 */
.dark .sider-themed {
  background: var(--bg-primary) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  border-right: 1px solid var(--border-color);
  position: relative;

  /* 添加微妙的渐变装饰条 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--theme-gradient);
    opacity: 0.6;
  }
}

.dark :deep(.ant-layout-sider) {
  background: var(--bg-primary) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  border-right: 1px solid var(--border-color);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--theme-gradient);
    opacity: 0.6;
  }
}

.dark :deep(.ant-layout-sider-collapsed) {
  background: var(--bg-primary) !important;
}

.dark :deep(.ant-layout-sider-trigger) {
  background: var(--hover-bg);
  color: var(--text-primary);
  border-top: 1px solid var(--border-color);
}

.dark :deep(.ant-layout-sider-trigger:hover) {
  background: var(--hover-bg-active);
}

/* 暗色模式下 logo 区域边框和文本颜色 */
.dark .logo-container {
  border-bottom: 1px solid var(--border-color);
}

.dark .logo-text {
  color: var(--text-primary) !important;
}

.dark .logo-icon {
  filter: brightness(1.2);
}
</style>
