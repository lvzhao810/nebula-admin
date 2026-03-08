<template>
  <div class="pdf-viewer">
    <!-- 工具栏 -->
    <div v-if="config.showToolbar" class="viewer-toolbar">
      <a-space>
        <a-button size="small" :disabled="currentPage <= 1" @click="previousPage">
          <template #icon><LeftOutlined /></template>
          上一页
        </a-button>
        <span class="page-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <a-button size="small" :disabled="currentPage >= totalPages" @click="nextPage">
          下一页
          <template #icon><RightOutlined /></template>
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" @click="zoomOut">
          <template #icon><ZoomOutOutlined /></template>
        </a-button>
        <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
        <a-button size="small" @click="zoomIn">
          <template #icon><ZoomInOutlined /></template>
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

    <!-- PDF 渲染区域 -->
    <div class="viewer-container" ref="containerRef">
      <a-spin :spinning="loading" tip="加载中...">
        <div v-if="error" class="error-state">
          <FilePdfOutlined class="error-icon" />
          <p>{{ error }}</p>
          <a-button type="primary" size="small" @click="loadPdf">重新加载</a-button>
        </div>
        <canvas
          v-else
          ref="canvasRef"
          class="pdf-canvas"
          :style="{
            width: canvasWidth + 'px',
            height: canvasHeight + 'px'
          }"
        />
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PrinterOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { PreviewConfig } from './types'
import * as pdfjsLib from 'pdfjs-dist'

// 配置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface Props {
  url: string
  config?: PreviewConfig
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    showToolbar: true,
    defaultScale: 1.0,
  }),
})

const emit = defineEmits<{
  load: [pages: number]
  error: [error: string]
}>()

// 状态
const loading = ref(true)
const error = ref('')
const pdfDoc = ref<any>(null)
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(props.config.defaultScale || 1.0)
const canvasRef = ref<HTMLCanvasElement>()
const containerRef = ref<HTMLElement>()

// Canvas 尺寸
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// 加载 PDF
async function loadPdf() {
  loading.value = true
  error.value = ''

  try {
    const loadingTask = pdfjsLib.getDocument(props.url)
    pdfDoc.value = await loadingTask.promise
    totalPages.value = pdfDoc.value.numPages
    currentPage.value = 1

    emit('load', totalPages.value)
    await renderPage(currentPage.value)
  } catch (e: any) {
    error.value = e.message || 'PDF 加载失败'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

// 渲染指定页面
async function renderPage(pageNum: number) {
  if (!pdfDoc.value || !canvasRef.value) return

  const page = await pdfDoc.value.getPage(pageNum)
  const viewport = page.getViewport({ scale: scale.value })

  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  if (!context) return

  canvas.width = viewport.width
  canvas.height = viewport.height

  canvasWidth.value = viewport.width
  canvasHeight.value = viewport.height

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise
}

// 翻页
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    renderPage(currentPage.value)
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    renderPage(currentPage.value)
  }
}

// 缩放
function zoomIn() {
  if (scale.value < 3) {
    scale.value += 0.25
    renderPage(currentPage.value)
  }
}

function zoomOut() {
  if (scale.value > 0.5) {
    scale.value -= 0.25
    renderPage(currentPage.value)
  }
}

// 打印
function print() {
  window.open(props.url, '_blank')
}

// 下载
async function download() {
  try {
    const response = await fetch(props.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.url.split('/').pop() || 'document.pdf'
    a.click()
    URL.revokeObjectURL(url)
    message.success('下载成功')
  } catch (e) {
    message.error('下载失败')
  }
}

// 监听 URL 变化
watch(() => props.url, () => {
  if (props.url) {
    loadPdf()
  }
})

onMounted(() => {
  if (props.url) {
    loadPdf()
  }
})
</script>

<style scoped lang="less">
.pdf-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-secondary);
}

.viewer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);

  .page-info {
    min-width: 60px;
    text-align: center;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .zoom-level {
    min-width: 45px;
    text-align: center;
    font-size: 13px;
    color: var(--text-secondary);
  }
}

.viewer-container {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
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

.pdf-canvas {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
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
