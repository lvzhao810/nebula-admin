<template>
  <div class="split-pane" ref="containerRef">
    <div class="pane pane-left" :style="leftStyle">
      <slot name="left" />
    </div>
    <div
      class="resizer"
      @mousedown="startResize"
    >
      <div class="resizer-line"></div>
    </div>
    <div class="pane pane-right" :style="rightStyle">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

interface Props {
  direction?: 'horizontal' | 'vertical'
  minPercent?: number
  defaultPercent?: number
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  minPercent: 10,
  defaultPercent: 50,
})

const containerRef = ref<HTMLElement>()
const percent = ref(props.defaultPercent)
const isResizing = ref(false)

const leftStyle = computed(() => {
  if (props.direction === 'horizontal') {
    return { width: `${percent.value}%` }
  }
  return { height: `${percent.value}%` }
})

const rightStyle = computed(() => {
  if (props.direction === 'horizontal') {
    return { width: `${100 - percent.value}%` }
  }
  return { height: `${100 - percent.value}%` }
})

function startResize() {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

function handleResize(e: MouseEvent) {
  if (!isResizing.value || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  let newPercent: number

  if (props.direction === 'horizontal') {
    newPercent = ((e.clientX - rect.left) / rect.width) * 100
  } else {
    newPercent = ((e.clientY - rect.top) / rect.height) * 100
  }

  percent.value = Math.max(props.minPercent, Math.min(100 - props.minPercent, newPercent))
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped lang="less">
.split-pane {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pane {
  overflow: auto;
}

.pane-left {
  flex-shrink: 0;
}

.pane-right {
  flex: 1;
}

.resizer {
  position: relative;
  flex-shrink: 0;
  background: #f0f0f0;
  cursor: col-resize;
  transition: background 0.2s ease;

  &:hover {
    background: var(--primary-color, #6366f1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 40px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
}

.resizer-line {
  width: 100%;
  height: 100%;
}
</style>
