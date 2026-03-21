<template>
  <template v-for="item in items" :key="item.path">
    <!-- 有子菜单的情况 -->
    <template v-if="item.children && item.children.length > 0">
      <a-sub-menu :key="item.path">
        <template #icon>
          <component :is="renderIcon(item.meta?.icon)" />
        </template>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
        <a-menu-item
          v-for="child in item.children"
          :key="child.path"
          @click="handleMenuClick(child)"
        >
          <template #icon>
            <component :is="renderIcon(child.meta?.icon)" />
          </template>
          <span>{{ child.meta?.title }}</span>
        </a-menu-item>
      </a-sub-menu>
    </template>

    <!-- 无子菜单的情况 -->
    <template v-else>
      <a-menu-item :key="item.path" @click="handleMenuClick(item)">
        <template #icon>
          <component :is="renderIcon(item.meta?.icon)" />
        </template>
        <span>{{ item.meta?.title }}</span>
      </a-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { iconMap } from '@/utils/icons'

defineProps<{
  items: any[]
}>()

const emit = defineEmits<{
  click: [item: any]
}>()

// 渲染图标
const renderIcon = (iconName: string | undefined) => {
  if (!iconName) return null
  const Icon = (iconMap as Record<string, any>)[iconName]
  return Icon ? h(Icon) : null
}

// 菜单点击事件
const handleMenuClick = (item: any) => {
  emit('click', item)
}
</script>
