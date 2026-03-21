<template>
  <div class="component-card">
    <div class="card-header">
      <h3 class="component-name">{{ demo.name }}</h3>
      <a-tag :color="getCategoryColor(demo.category)">
        {{ getCategoryLabel(demo.category) }}
      </a-tag>
    </div>

    <div class="card-preview">
      <a-spin :spinning="loading" tip="加载中...">
        <component
          v-if="!loading && componentInstance"
          :is="componentInstance"
          v-bind="demo.previewData"
          class="preview-content"
        />
        <div v-else class="preview-placeholder"></div>
      </a-spin>
    </div>

    <div class="card-footer">
      <p class="description">{{ demo.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ComponentDemo } from '../data/components'

const props = defineProps<{
  demo: ComponentDemo
}>()

const loading = ref(true)
const componentInstance = ref<any>(null)

// 加载组件
const loadComponent = async () => {
  loading.value = true
  componentInstance.value = null

  try {
    const module = await props.demo.component()
    componentInstance.value = module.default || module
    // 组件加载完成后，延迟一点再显示，确保组件已完全初始化
    setTimeout(() => {
      loading.value = false
    }, 100)
  } catch (error) {
    console.error(`Failed to load component ${props.demo.name}:`, error)
    loading.value = false
  }
}

watch(
  () => props.demo.component,
  () => {
    loadComponent()
  },
  { immediate: true }
)

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    data_display: '数据展示',
    form: '表单组件',
    upload_select: '上传选择',
    layout: '布局组件',
  }
  return map[category] || category
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    data_display: 'blue',
    form: 'green',
    upload_select: 'orange',
    layout: 'purple',
  }
  return colors[category] || 'default'
}
</script>

<style scoped lang="less">
.component-card {
  border-radius: 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--card-bg, #fff);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}

.component-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.card-preview {
  padding: 24px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary, #f9fafb);

  .preview-content {
    width: 100%;
  }

  .preview-placeholder {
    width: 100%;
    min-height: 150px;
  }
}

.card-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color, #f0f0f0);
}

.description {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}
</style>
