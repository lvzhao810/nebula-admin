<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="text-9xl font-bold text-gradient mb-4">404</div>
      <h1 class="text-2xl font-medium text-gray-700 mb-2">页面不存在</h1>
      <p class="text-gray-500 mb-8">抱歉，您访问的页面不存在或已被删除</p>
      <a-button type="primary" @click="router.push('/dashboard')">
        返回首页
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
