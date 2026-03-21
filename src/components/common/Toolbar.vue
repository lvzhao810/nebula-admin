<template>
  <div class="toolbar flex items-center justify-between mb-4">
    <!-- 左侧内容 -->
    <div class="flex items-center gap-3">
      <slot name="left" />
      <template v-if="buttons && buttons.length > 0">
        <a-button
          v-for="btn in buttons"
          :key="btn.key"
          :type="btn.type"
          :danger="btn.danger"
          :disabled="btn.disabled"
          @click="handleClick(btn)"
        >
          <template v-if="getIconComponent(btn.icon)" #icon>
            <component :is="getIconComponent(btn.icon)" />
          </template>
          {{ btn.label }}
        </a-button>
      </template>
    </div>

    <!-- 右侧内容 -->
    <div class="flex items-center gap-3">
      <slot name="right" />
      <a-button v-if="showRefresh" @click="handleRefresh">
        <template #icon><Icons.ReloadOutlined /></template>
        刷新
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import * as Icons from '@ant-design/icons-vue'

export interface ToolbarButton {
  key: string
  label: string
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  icon?: string
  danger?: boolean
  disabled?: boolean
}

// 解析图标组件
const getIconComponent = (iconName?: string) => {
  if (!iconName) return undefined
  const Icon = (Icons as any)[iconName]
  return Icon ? h(Icon) : undefined
}

interface Props {
  buttons?: ToolbarButton[]
  showRefresh?: boolean
}

withDefaults(defineProps<Props>(), {
  buttons: () => [],
  showRefresh: false,
})

const emit = defineEmits<{
  click: [button: ToolbarButton]
  refresh: []
}>()

const handleClick = (btn: ToolbarButton) => emit('click', btn)

const handleRefresh = () => emit('refresh')
</script>
