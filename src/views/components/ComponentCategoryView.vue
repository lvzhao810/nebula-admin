<template>
  <div class="component-category-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <component :is="categoryIcon" class="title-icon" />
          {{ categoryInfo.title }}
        </h1>
        <p class="page-description">{{ categoryInfo.description }}</p>
      </div>
    </div>

    <!-- 组件网格 -->
    <div v-if="components.length > 0" class="components-grid">
      <router-link
        v-for="component in components"
        :key="component.name"
        :to="getComponentRoute(component)"
        class="component-card"
      >
        <div class="card-header">
          <h3 class="component-name">{{ component.title }}</h3>
          <a-tag color="blue">{{ component.name }}</a-tag>
        </div>
        <div class="card-body">
          <p class="description">{{ component.description }}</p>
          <div v-if="component.tags" class="tags">
            <a-tag v-for="tag in component.tags" :key="tag" color="green" size="small">
              {{ tag }}
            </a-tag>
          </div>
        </div>
        <div class="card-footer">
          <a-button type="link" size="small">
            查看详情 <template #icon><Icons.ArrowRightOutlined /></template>
          </a-button>
        </div>
      </router-link>
    </div>

    <!-- 空状态 -->
    <a-empty v-else description="暂无组件" />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import * as Icons from '@ant-design/icons-vue'
import { componentDemos, type ComponentDemo } from './data/components'

const route = useRoute()

const categoryMap: Record<string, { title: string; description: string; icon: any }> = {
  'data-display': { title: '数据展示', description: '用于展示各类数据的组件，包括统计卡片、表格、列表等', icon: Icons.BarChartOutlined },
  form: { title: '表单组件', description: '用于数据输入和表单操作的组件', icon: Icons.FormOutlined },
  'upload-select': { title: '上传选择', description: '文件上传、选择器等组件', icon: Icons.UploadOutlined },
  layout: { title: '布局组件', description: '页面布局和容器类组件', icon: Icons.LayoutOutlined },
  'drag-drop': { title: '拖拽组件', description: '支持拖拽操作的组件', icon: Icons.DragOutlined },
  editor: { title: '编辑器组件', description: '各类编辑器组件', icon: Icons.EditOutlined },
  table: { title: '表格增强', description: '增强功能的表格组件', icon: Icons.TableOutlined },
  interaction: { title: '交互组件', description: '用户交互相关组件', icon: Icons.InteractionOutlined },
}

const currentCategory = computed(() => {
  const match = route.path.match(/\/components\/([^/]+)/)
  return match?.[1] || 'data-display'
})

const categoryInfo = computed(() => categoryMap[currentCategory.value] || categoryMap['data-display'])

const categoryIcon = computed(() => h(categoryInfo.value.icon))

const components = computed(() =>
  componentDemos.filter((c: ComponentDemo) => c.category === currentCategory.value)
)

const getComponentRoute = (component: ComponentDemo) =>
  `/components/${currentCategory.value}/${component.route}`
</script>

<style scoped lang="less">
.component-category-view {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  text-align: center;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary, #1f2937);

  .title-icon {
    font-size: 36px;
    color: var(--primary-color, #6366f1);
  }
}

.page-description {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary, #6b7280);
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.component-card {
  border-radius: 12px;
  border: 1px solid var(--border-color, #e5e7eb);
  background: var(--card-bg, #fff);
  padding: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.component-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.card-body {
  flex: 1;
}

.description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #f0f0f0);
}
</style>
