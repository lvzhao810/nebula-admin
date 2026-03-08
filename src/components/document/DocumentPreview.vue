<template>
  <a-modal
    v-model:open="visible"
    :title="document?.name || '文档预览'"
    :width="width || 1000"
    :footer="null"
    :destroyOnClose="true"
    @cancel="handleClose"
    class="document-preview-modal"
  >
    <div class="document-preview" :style="{ height: height || '600px' }">
      <!-- 不支持预览的文档类型 -->
      <div v-if="!canPreview" class="no-preview">
        <FileOutlined class="file-icon" />
        <p class="file-name">{{ document?.name }}</p>
        <p class="file-hint">此文件类型不支持在线预览</p>
        <a-space>
          <a-button type="primary" @click="handleDownload">
            <template #icon><DownloadOutlined /></template>
            下载文件
          </a-button>
          <a-button @click="handleClose">关闭</a-button>
        </a-space>
      </div>

      <!-- PDF 预览 -->
      <PdfViewer
        v-else-if="document?.type === 'pdf'"
        :url="document.url"
        :config="previewConfig"
      />

      <!-- 图片预览 -->
      <DocImagePreview
        v-else-if="document?.type === 'image'"
        :url="document.url"
        :show-toolbar="previewConfig?.showToolbar"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DownloadOutlined, FileOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PdfViewer from './PdfViewer.vue'
import DocImagePreview from './DocImagePreview.vue'
import type { DocumentInfo, DocumentType, PreviewConfig } from './types'

interface Props {
  open: boolean
  document?: DocumentInfo | null
  width?: number
  height?: string
  previewConfig?: PreviewConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const visible = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

// 判断是否可以预览
const canPreview = computed(() => {
  if (!props.document) return false
  return ['pdf', 'image'].includes(props.document.type)
})

// 获取文档类型
function getDocumentType(filename: string): DocumentType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const pdfExts = ['pdf']

  if (pdfExts.includes(ext)) return 'pdf'
  if (imageExts.includes(ext)) return 'image'
  if (['doc', 'docx'].includes(ext)) return 'word'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'excel'
  return 'other'
}

// 下载文件
async function handleDownload() {
  if (!props.document) return

  try {
    const response = await fetch(props.document.url)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.document.name
    a.click()
    URL.revokeObjectURL(url)
    message.success('下载成功')
  } catch (e) {
    message.error('下载失败')
  }
}

// 关闭弹窗
function handleClose() {
  visible.value = false
  emit('close')
}

// 监听文档变化，自动确定类型
watch(() => props.document, (doc) => {
  if (doc && !doc.type) {
    // 如果没有指定类型，根据文件名自动判断
    ;(doc as any).type = getDocumentType(doc.name)
  }
})
</script>

<style lang="less">
.document-preview-modal {
  .ant-modal-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-modal-body {
    flex: 1;
    padding: 0;
    overflow: hidden;
  }
}
</style>

<style scoped lang="less">
.document-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 20px;
  text-align: center;

  .file-icon {
    font-size: 64px;
    color: var(--text-tertiary);
    margin-bottom: 16px;
  }

  .file-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .file-hint {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }
}
</style>
