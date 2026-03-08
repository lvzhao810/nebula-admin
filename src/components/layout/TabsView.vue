<template>
  <div class="tabs-view">
    <div class="tabs-wrapper">
      <div class="tabs-container" ref="tabsContainer" role="tablist">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: tab.key === activeKey }]"
          role="tab"
          :aria-selected="tab.key === activeKey"
          tabindex="0"
          @click="handleTabClick(tab)"
          @keydown.enter="handleTabClick(tab)"
        >
          <span class="tab-title">{{ tab.title }}</span>
          <span
            class="tab-close"
            tabindex="0"
            role="button"
            :aria-label="`关闭 ${tab.title}`"
            @click.stop="handleClose(tab)"
            @keydown.enter.stop="handleClose(tab)"
          >
            <CloseOutlined />
          </span>
        </div>
      </div>

      <div class="tabs-actions">
        <a-dropdown :trigger="['click']">
          <a-button type="text" size="small" class="action-btn" aria-label="标签操作菜单">
            <template #icon>
              <DownOutlined />
            </template>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleCloseOther">
                <CloseCircleOutlined />
                关闭其他
              </a-menu-item>
              <a-menu-item @click="handleCloseAll">
                <CloseCircleOutlined />
                关闭所有
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useTabsStore } from '@/stores/tabs'
import { CloseOutlined, DownOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import type { Tab } from '@/stores/tabs'

const router = useRouter()
const tabsStore = useTabsStore()

const tabs = computed(() => tabsStore.tabs)
const activeKey = computed(() => tabsStore.activeKey)

const tabsContainer = ref<HTMLElement>()

// 合并 watch，避免重复调用 addTab
watch(
  [() => router.currentRoute.value, () => tabsStore.visible],
  ([route, isVisible]) => {
    if (isVisible && route) {
      tabsStore.addTab(route)
    }
  },
  { immediate: true }
)

// 监听激活标签变化，同步路由
watch(() => activeKey.value, async (newKey) => {
  if (newKey && newKey !== router.currentRoute.value.path) {
    try {
      await router.push(newKey)
    } catch (error) {
      console.error('导航失败:', error)
    }
  }
})

function handleTabClick(tab: Tab) {
  tabsStore.setActiveTab(tab.key)
}

async function handleClose(tab: Tab) {
  try {
    const navigateTo = tabsStore.closeTab(tab.key)
    if (navigateTo) {
      await router.push(navigateTo)
    }
  } catch (error) {
    console.error('关闭标签失败:', error)
    message.error('关闭标签失败')
  }
}

function handleCloseOther() {
  tabsStore.closeOtherTabs(router.currentRoute.value.path)
}

async function handleCloseAll() {
  try {
    tabsStore.closeAllTabs()
    await router.push('/dashboard')
  } catch (error) {
    console.error('关闭所有标签失败:', error)
    message.error('操作失败')
  }
}
</script>

<style scoped lang="less">
.tabs-view {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 4px 16px;
  user-select: none;
  flex-shrink: 0;
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tabs-container {
  flex: 1;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: var(--scrollbar-thumb);

    &:hover {
      background: var(--theme-secondary);
    }
  }
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 13px;
  color: var(--text-secondary);
  flex-shrink: 0;

  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  &.active {
    background: var(--theme-gradient);
    border-color: var(--theme-primary);
    color: #fff;

    .tab-close {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        color: #fff;
      }
    }
  }
}

.tab-title {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  font-size: 10px;
  transition: all 0.2s;
  opacity: 0.7;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    opacity: 1;
  }
}

.tabs-actions {
  flex-shrink: 0;
}

.action-btn {
  color: var(--text-secondary);

  &:hover {
    color: var(--theme-primary);
  }
}

/* 暗色模式 */
.dark .tab-item {
  &.active {
    background: var(--theme-gradient);
    border-color: var(--theme-primary);

    .tab-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .tab-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
