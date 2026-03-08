<template>
  <transition name="fade">
    <div v-if="visible" class="back-to-top" @click="scrollToTop">
      <div class="back-to-top-button">
        <Icons.VerticalAlignTopOutlined />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as Icons from '@ant-design/icons-vue'

interface Props {
  visibilityHeight?: number
  backPosition?: number
}

const props = withDefaults(defineProps<Props>(), {
  visibilityHeight: 400,
  backPosition: 0,
})

const visible = ref(false)

const handleScroll = () => {
  visible.value = window.scrollY > props.visibilityHeight
}

const scrollToTop = () => {
  window.scrollTo({
    top: props.backPosition,
    behavior: 'smooth',
  })
}

onMounted(() => window.addEventListener('scroll', handleScroll))

onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped lang="less">
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 40px;
  z-index: 99;
  cursor: pointer;
}

.back-to-top-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color, #6366f1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
