<template>
  <div class="stat-card bg-card-bg rounded-lg p-6 shadow-sm card-hover">
    <div class="flex items-center justify-between gap-4">
      <div class="flex-1">
        <p class="text-text-secondary text-xs mb-2 font-medium">{{ title }}</p>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-text-primary tabular-nums">
            {{ prefix }}{{ formattedValue }}
          </span>
          <span
            class="text-xs font-medium trend-indicator"
            :class="trend >= 0 ? 'trend-positive' : 'trend-negative'"
          >
            {{ trend >= 0 ? '↑' : '↓' }}{{ Math.abs(trend) }}%
          </span>
        </div>
      </div>
      <div
        class="w-12 h-12 rounded-md bg-gradient-to-br flex items-center justify-center shadow-md flex-shrink-0"
        :class="color"
      >
        <component :is="renderIcon" class="text-white text-xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { iconMap } from '@/utils/icons'

const props = defineProps<{
  title: string
  value: number
  trend: number
  icon: string
  color: string
  prefix?: string
}>()

const formattedValue = computed(() => {
  return props.value.toLocaleString()
})

const renderIcon = () => {
  if (!props.icon) return null
  const Icon = iconMap[props.icon]
  return Icon ? h(Icon) : null
}
</script>

<style scoped>
.stat-card {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
  border: 1px solid var(--border-color);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 趋势指示器颜色 - 亮色模式 */
.trend-positive {
  color: #10b981;
}

.trend-negative {
  color: #ef4444;
}

/* 暗色模式下的趋势颜色 - 更柔和 */
.dark .trend-positive {
  color: #34d399;
}

.dark .trend-negative {
  color: #f87171;
}
</style>
