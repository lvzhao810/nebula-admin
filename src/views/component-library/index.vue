<template>
  <div class="component-library">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <AppstoreOutlined class="title-icon" />
          组件库
        </h1>
        <p class="page-description">
          查看和体验所有封装的业务组件，快速构建你的应用
        </p>
      </div>
    </div>

    <!-- 分类标签页 -->
    <CategoryTabs @change="handleCategoryChange" />

    <!-- 组件网格 -->
    <div class="components-grid">
      <ComponentCard
        v-for="demo in filteredComponents"
        :key="demo.name"
        :demo="demo"
      />
    </div>

    <!-- 空状态 -->
    <a-empty
      v-if="filteredComponents.length === 0"
      description="该分类下暂无组件"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import { componentDemos, ComponentCategory } from './data/components'
import CategoryTabs from './components/CategoryTabs.vue'
import ComponentCard from './components/ComponentCard.vue'

const currentCategory = ref<ComponentCategory>(ComponentCategory.DATA_DISPLAY)

const filteredComponents = computed(() => {
  return componentDemos.filter((demo) => demo.category === currentCategory.value)
})

function handleCategoryChange(category: string) {
  currentCategory.value = category as ComponentCategory
}
</script>

<style scoped lang="less">
.component-library {
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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}
</style>
