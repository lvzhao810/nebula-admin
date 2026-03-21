<template>
  <a-config-provider :theme="antTheme">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { useThemeStore, themeStyles } from '@/stores/theme'

const themeStore = useThemeStore()

// 动态 Ant Design 主题配置
const antTheme = computed(() => {
  const currentTheme = themeStyles[themeStore.style]
  const isDark = themeStore.isDark

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: currentTheme.primary,
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#3b82f6',
      borderRadius: 8,
      controlHeight: 38,
      fontSize: 14,
    },
    components: {
      Layout: {
        headerBg: isDark ? '#1e293b' : '#ffffff',
        headerHeight: 56,
        siderBg: isDark ? '#1e293b' : '#ffffff',
        bodyBg: isDark ? '#0f172a' : '#f5f7fa',
      } as any,
      Menu: {
        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
        colorItemBg: 'transparent',
        colorItemText: isDark ? '#94a3b8' : '#64748b',
        colorItemTextSelected: currentTheme.primary,
        colorItemBgSelected: isDark
          ? `${currentTheme.primary}15`
          : `${currentTheme.primary}10`,
        colorItemTextHover: currentTheme.primary,
      },
      Button: {
        colorPrimary: currentTheme.primary,
        colorPrimaryHover: currentTheme.secondary,
        controlHeight: 38,
      },
      Card: {
        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
      },
      Table: {
        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
        headerColor: isDark ? '#334155' : '#f1f5f9',
        headerSortHoverBg: isDark ? '#334155' : '#f1f5f9',
      },
      Input: {
        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
        colorBorder: isDark ? '#374151' : '#e5e7eb',
        colorText: isDark ? '#f1f5f9' : '#1f2937',
        colorTextPlaceholder: isDark ? '#6b7280' : '#9ca3af',
      },
      Select: {
        colorBgContainer: isDark ? '#1e293b' : '#ffffff',
        colorBorder: isDark ? '#374151' : '#e5e7eb',
        optionSelectedBg: isDark
          ? `${currentTheme.primary}15`
          : `${currentTheme.primary}10`,
      },
      Modal: {
        contentBg: isDark ? '#1e293b' : '#ffffff',
        headerBg: isDark ? '#1e293b' : '#ffffff',
      },
      Dropdown: {
        colorBgElevated: isDark ? '#1e293b' : '#ffffff',
      },
    },
  }
})
</script>

<style scoped>
/* 确保主题过渡平滑 */
:deep(.ant-layout) {
  transition: background-color 0.3s ease;
}

:deep(.ant-menu) {
  transition: all 0.3s ease;
}

:deep(.ant-card) {
  transition: background-color 0.3s ease;
}
</style>
