<template>
  <div class="image-preview">
    <img :src="src" :alt="alt" class="preview-image" @click="openPreview" />

    <a-modal
      v-model:open="visible"
      :footer="null"
      :centered="true"
      width="90%"
      wrap-class-name="image-preview-modal"
    >
      <div class="preview-container">
        <img
          :src="src"
          :alt="alt"
          :style="imageStyle"
          class="modal-image"
          @wheel.prevent="handleWheel"
        />
      </div>

      <div class="toolbar">
        <a-space>
          <a-button size="small" @click="zoomIn">
            <template #icon><ZoomInOutlined /></template>
            放大
          </a-button>
          <a-button size="small" @click="zoomOut">
            <template #icon><ZoomOutOutlined /></template>
            缩小
          </a-button>
          <a-button size="small" @click="rotateLeft">
            <template #icon><RotateLeftOutlined /></template>
            左旋转
          </a-button>
          <a-button size="small" @click="rotateRight">
            <template #icon><RotateRightOutlined /></template>
            右旋转
          </a-button>
          <a-button size="small" @click="reset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'

interface Props {
  src: string
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'image',
})

const visible = ref(false)
const scale = ref(1)
const rotation = ref(0)

const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotation.value}deg)`,
  transition: 'transform 0.3s ease',
  maxWidth: '100%',
  maxHeight: '70vh',
}))

function openPreview() {
  visible.value = true
}

function zoomIn() {
  scale.value = Math.min(scale.value + 0.2, 3)
}

function zoomOut() {
  scale.value = Math.max(scale.value - 0.2, 0.2)
}

function rotateLeft() {
  rotation.value -= 90
}

function rotateRight() {
  rotation.value += 90
}

function reset() {
  scale.value = 1
  rotation.value = 0
}

function handleWheel(event: WheelEvent) {
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}
</script>

<style scoped lang="less">
.preview-image {
  max-width: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.modal-image {
  display: block;
  margin: 0 auto;
}

.toolbar {
  margin-top: 16px;
  text-align: center;
}
</style>

<style>
.image-preview-modal .ant-modal-content {
  background: transparent;
  box-shadow: none;
}

.image-preview-modal .ant-modal-body {
  padding: 0;
}
</style>
