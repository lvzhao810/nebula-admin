<template>
  <div class="image-preview">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="preview-toolbar">
      <a-space>
        <a-button size="small" @click="rotateLeft">
          <template #icon><RotateLeftOutlined /></template>
          左旋转
        </a-button>
        <a-button size="small" @click="rotateRight">
          右旋转
          <template #icon><RotateRightOutlined /></template>
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" @click="zoomOut">
          <template #icon><ZoomOutOutlined /></template>
        </a-button>
        <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
        <a-button size="small" @click="zoomIn">
          <template #icon><ZoomInOutlined /></template>
        </a-button>
        <a-button size="small" @click="resetZoom">
          <template #icon><CompressOutlined /></template>
          重置
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" @click="print">
          <template #icon><PrinterOutlined /></template>
          打印
        </a-button>
        <a-button size="small" @click="download">
          <template #icon><DownloadOutlined /></template>
          下载
        </a-button>
      </a-space>
    </div>

    <!-- 图片显示区域 -->
    <div class="preview-container" ref="containerRef">
      <a-spin :spinning="loading" tip="加载中...">
        <div v-if="error" class="error-state">
          <FileImageOutlined class="error-icon" />
          <p>{{ error }}</p>
          <a-button type="primary" size="small" @click="loadImage">重新加载</a-button>
        </div>
        <img
          v-else
          ref="imageRef"
          :src="currentUrl"
          :style="imageStyle"
          @load="onLoad"
          @error="onError"
          class="preview-image"
          alt="预览图片"
        />
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CompressOutlined,
  PrinterOutlined,
  DownloadOutlined,
  FileImageOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { PreviewConfig } from './types'

interface Props {
  url: string
  showToolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToolbar: true,
})

const emit = defineEmits<{
  load: []
  error: [error: string]
}>()

// 状态
const loading = ref(true)
const error = ref('')
const scale = ref(1)
const rotation = ref(0)
const currentUrl = ref('')
const imageRef = ref<HTMLImageElement>()
const containerRef = ref<HTMLElement>()

// 图片样式
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotation.value}deg)`,
  transition: 'transform 0.3s ease',
}))

// 加载图片
function loadImage() {
  loading.value = true
  error.value = ''
  currentUrl.value = props.url
}

// 图片加载完成
function onLoad() {
  loading.value = false
  emit('load')
}

// 图片加载失败
function onError() {
  loading.value = false
  error.value = '图片加载失败'
  emit('error', error.value)
}

// 旋转
function rotateLeft() {
  rotation.value -= 90
}

function rotateRight() {
  rotation.value += 90
}

// 缩放
function zoomIn() {
  if (scale.value < 5) {
    scale.value += 0.25
  }
}

function zoomOut() {
  if (scale.value > 0.1) {
    scale.value -= 0.25
  }
}

function resetZoom() {
  scale.value = 1
  rotation.value = 0
}

// 打印
function print() {
  if (!imageRef.value) return

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>打印图片</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          img { max-width: 100%; max-height: 100vh; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${props.url}" onload="window.print(); window.close();" />
      </body>
    </html>
  `)
  printWindow.document.close()
}

// 下载
async function download() {
  try {
    const response = await fetch(props.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.url.split('/').pop() || 'image'
    a.click()
    URL.revokeObjectURL(url)
    message.success('下载成功')
  } catch (e) {
    message.error('下载失败')
  }
}

// 初始化
loadImage()
</script>

<style scoped lang="less">
.image-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-secondary);
}

.preview-toolbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);

  .zoom-level {
    min-width: 45px;
    text-align: center;
    font-size: 13px;
    color: var(--text-secondary);
  }
}

.preview-container {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
  }
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  .error-icon {
    font-size: 48px;
    color: var(--text-tertiary);
    margin-bottom: 16px;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 16px;
  }
}
</style>
