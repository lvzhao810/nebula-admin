<template>
  <div class="component-detail-layout">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">
        {{ componentInfo?.name }}
        <a-tag v-if="componentInfo?.tags && componentInfo.tags.length > 0" color="blue">{{ componentInfo.tags[0] }}</a-tag>
      </h1>
      <p class="page-description">{{ componentInfo?.description }}</p>
    </div>

    <!-- 演示区域 -->
    <a-card title="演示" class="demo-card" :bordered="false">
      <router-view />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getComponentByRoute } from '@/config/components'

const route = useRoute()

const componentInfo = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  // 路由结构: /components/{category}/{route}/index
  // 需要获取倒数第二个元素 (route)
  const componentRoute = pathSegments.length >= 2 ? pathSegments[pathSegments.length - 2] : null
  return componentRoute ? getComponentByRoute(componentRoute) : null
})
</script>

<style scoped lang="less">
.component-detail-layout {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
}

.page-description {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary, #6b7280);
}

.demo-card {
  :deep(.ant-card-head) {
    background: var(--card-bg, #fff);
    border-bottom: 2px solid var(--theme-primary, #6366f1);
  }

  :deep(.ant-card-head-title) {
    font-weight: 600;
    font-size: 18px;
  }
}
</style>
