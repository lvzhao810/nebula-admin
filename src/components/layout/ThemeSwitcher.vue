<template>
  <div class="flex items-center gap-2">
    <!-- 主题模式切换 -->
    <a-tooltip :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
      <div
        @click="toggleMode"
        class="theme-toggle p-2 rounded-md hover:bg-hover-bg transition-all cursor-pointer"
        :class="{ 'scale-95': isToggling }"
      >
        <span class="theme-icon" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
          {{ isDark ? '🌙' : '☀️' }}
        </span>
      </div>
    </a-tooltip>

    <!-- 主题风格选择器 -->
    <a-dropdown placement="bottomRight" :trigger="['click']">
      <div class="flex items-center gap-1 p-2 rounded-md hover:bg-hover-bg transition-colors cursor-pointer">
        <div
          class="w-5 h-5 rounded-sm transition-transform hover:scale-110"
          :style="{ background: `linear-gradient(135deg, ${getGradientColors(style, isDark)})` }"
        />
      </div>
      <template #overlay>
        <a-menu class="theme-selector-menu" :selectable="false">
          <div class="p-3">
            <div class="text-xs text-text-secondary mb-3 px-2 font-medium">主题风格</div>

            <!-- 主题选项列表 -->
            <div
              v-for="(theme, key) in themeStyles"
              :key="key"
              class="theme-option"
              :class="{ 'theme-option-active': key === style }"
              @click="setThemeStyle(key as ThemeStyle)"
            >
              <div
                class="w-9 h-9 rounded-md mr-3 flex items-center justify-center text-white flex-shrink-0"
                :style="{ background: `linear-gradient(135deg, ${getGradientColors(key, isDark)})` }"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-text-primary text-sm">{{ theme.name }}</div>
                <div class="text-xs text-text-tertiary truncate">{{ theme.description }}</div>
              </div>
              <CheckOutlined v-if="key === style" class="ml-auto text-sm flex-shrink-0" />
            </div>
          </div>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { useThemeStore, themeStyles, type ThemeStyle } from '@/stores/theme'

const themeStore = useThemeStore()
const isToggling = ref(false)

const isDark = computed(() => themeStore.isDark)
const style = computed(() => themeStore.style)

// 获取主题渐变色
const getGradientColors = (key: ThemeStyle, dark = false): string => {
  const gradients: Record<ThemeStyle, { light: string; dark: string }> = {
    nebula: { light: '#7c3aed, #a78bfa', dark: '#a78bfa, #c4b5fd' },
    ocean: { light: '#0ea5e9, #06b6d4', dark: '#06b6d4, #22d3ee' },
    forest: { light: '#22c55e, #10b981', dark: '#10b981, #34d399' },
    sunset: { light: '#f97316, #ef4444', dark: '#f97316, #fb923c' },
    cherry: { light: '#ec4899, #db2777', dark: '#ec4899, #f472b6' },
    midnight: { light: '#3b82f6, #6366f1', dark: '#60a5fa, #818cf8' },
  }
  const colors = gradients[key]
  return dark ? colors.dark : colors.light
}

// 切换白天/黑夜模式
const toggleMode = async () => {
  isToggling.value = true
  await themeStore.toggleMode()
  setTimeout(() => {
    isToggling.value = false
  }, 200)
}

// 设置主题风格
const setThemeStyle = (styleKey: ThemeStyle) => {
  themeStore.setStyle(styleKey)
}
</script>

<style scoped lang="less">
.theme-icon {
  display: inline-block;
  font-size: 18px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));

  &.light-mode {
    animation: sun-rotate 20s linear infinite;
  }

  &.dark-mode {
    animation: moon-float 3s ease-in-out infinite;
  }
}

@keyframes sun-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes moon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.theme-toggle {
  transition: transform 200ms ease-out, background-color 200ms ease-out;

  &:hover .theme-icon {
    transform: scale(1.1);
  }
}

.theme-toggle:hover {
  transform: scale(1.05);
}

.theme-selector-menu {
  min-width: 280px;
  max-width: 320px;

  .ant-dropdown-menu {
    background: var(--card-bg);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
  }
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 200ms ease-out;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);

  &:hover {
    border-color: var(--theme-secondary);
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  &.theme-option-active {
    background: var(--hover-bg-active);
    border-color: var(--theme-primary);
    box-shadow: var(--shadow-sm);
  }
}
</style>
