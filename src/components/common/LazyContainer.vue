<template>
  <div
    ref="containerRef"
    class="lazy-container"
    :style="{ minHeight: `${placeholderHeight}px` }"
  >
    <slot v-if="isVisible" />
    <div v-else class="lazy-placeholder">
      <a-spin :spinning="true" size="large" />
      <p class="placeholder-text">加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

interface Props {
  placeholderHeight?: number
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholderHeight: 300,
  threshold: 0.1,
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  containerRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true
    }
  },
  {
    threshold: props.threshold,
  }
)
</script>

<style scoped lang="less">
.lazy-container {
  width: 100%;
}

.lazy-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary, #6b7280);
}

.placeholder-text {
  margin-top: 16px;
  font-size: 14px;
}
</style>
