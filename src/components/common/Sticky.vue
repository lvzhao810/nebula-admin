<template>
  <div class="sticky-wrapper" :style="{ height: `${height}px` }">
    <div
      class="sticky-content"
      :class="{ 'is-sticky': isSticky }"
      :style="stickyStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  offsetTop?: number
  zIndex?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  offsetTop: 0,
  zIndex: 99,
  disabled: false,
})

const isSticky = ref(false)
const height = ref(0)
const stickyContentRef = ref<HTMLElement>()

const stickyStyle = computed(() => ({
  top: isSticky.value ? `${props.offsetTop}px` : '0',
  zIndex: props.zIndex,
}))

function handleScroll() {
  if (props.disabled || !stickyContentRef.value) return

  const rect = stickyContentRef.value.getBoundingClientRect()
  height.value = rect.height

  if (rect.top <= props.offsetTop) {
    isSticky.value = true
  } else {
    isSticky.value = false
  }
}

onMounted(() => {
  stickyContentRef.value = document.querySelector('.sticky-content') as HTMLElement
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="less">
.sticky-wrapper {
  position: relative;
}

.sticky-content {
  width: 100%;

  &.is-sticky {
    position: fixed;
    width: 100%;
  }
}
</style>
