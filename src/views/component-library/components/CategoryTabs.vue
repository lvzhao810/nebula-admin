<template>
  <div class="category-tabs">
    <a-tabs v-model:activeKey="activeCategory" @change="handleTabChange">
      <a-tab v-for="cat in categories" :key="cat.key">
        <template #tab>
          <span class="tab-content">
            <component :is="iconMap[cat.icon]" class="tab-icon" />
            <span class="tab-label">{{ cat.label }}</span>
            <span class="tab-count">{{ getComponentCount(cat.key) }}</span>
          </span>
        </template>
      </a-tab>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categories } from '../data/components'
import { componentDemos } from '../data/components'
import {
  BarChartOutlined,
  FormOutlined,
  UploadOutlined,
  LayoutOutlined,
} from '@ant-design/icons-vue'

const emit = defineEmits<{
  change: [category: string]
}>()

const activeCategory = ref(categories[0].key)

const iconMap: Record<string, any> = {
  BarChartOutlined,
  FormOutlined,
  UploadOutlined,
  LayoutOutlined,
}

function getComponentCount(category: string): number {
  return componentDemos.filter((demo) => demo.category === category).length
}

function handleTabChange(key: string) {
  activeCategory.value = key
  emit('change', key)
}
</script>

<style scoped lang="less">
.category-tabs {
  :deep(.ant-tabs-nav) {
    margin-bottom: 24px;
  }
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  font-size: 14px;
  font-weight: 500;
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--primary-color, #6366f1);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}
</style>
