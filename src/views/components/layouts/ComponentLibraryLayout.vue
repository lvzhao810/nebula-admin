<template>
  <div class="component-library-layout">
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </div>
</template>

<script setup lang="ts">
// 组件库布局 - 简化版，仅显示内容
</script>

<style scoped lang="less">
.component-library-layout {
  width: 100%;
  height: 100%;
}

.content {
  padding: 24px;
  height: 100%;
}
</style>
