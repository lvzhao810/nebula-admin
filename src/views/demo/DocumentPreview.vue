<template>
  <div class="document-preview-page">
    <a-card title="文档预览/打印/下载 演示" :bordered="false">
      <!-- 文档预览示例 -->
      <a-divider orientation="left">文档预览</a-divider>
      <a-space wrap>
        <a-button type="primary" @click="previewPdf">
          <template #icon><FilePdfOutlined /></template>
          预览 PDF
        </a-button>
        <a-button type="primary" @click="previewImage">
          <template #icon><FileImageOutlined /></template>
          预览图片
        </a-button>
        <a-button @click="previewWord">
          <template #icon><FileWordOutlined /></template>
          Word 文档（不支持预览）
        </a-button>
      </a-space>

      <!-- 打印模板示例 -->
      <a-divider orientation="left">打印模板</a-divider>
      <a-space wrap>
        <a-button type="primary" @click="printVoucher">
          <template #icon><PrinterOutlined /></template>
          打印凭证
        </a-button>
        <a-button type="primary" @click="showVoucherPreview">
          <template #icon><EyeOutlined /></template>
          预览凭证
        </a-button>
        <a-button @click="printIdCard">
          <template #icon><IdcardOutlined /></template>
          打印 ID 卡
        </a-button>
        <a-button @click="showIdCardPreview">
          <template #icon><EyeOutlined /></template>
          预览 ID 卡
        </a-button>
      </a-space>

      <!-- 下载功能示例 -->
      <a-divider orientation="left">下载功能</a-divider>
      <a-space wrap>
        <a-button type="primary" @click="downloadTextFile">
          <template #icon><DownloadOutlined /></template>
          下载文本文件
        </a-button>
        <a-button @click="downloadCsvFile">
          <template #icon><DownloadOutlined /></template>
          下载 CSV 文件
        </a-button>
        <a-button @click="downloadJsonFile">
          <template #icon><DownloadOutlined /></template>
          下载 JSON 文件
        </a-button>
      </a-space>

      <!-- 上传预览 -->
      <a-divider orientation="left">上传预览</a-divider>
      <a-upload
        :before-upload="handleBeforeUpload"
        :show-upload-list="false"
        accept=".pdf,.jpg,.jpeg,.png,.gif"
      >
        <a-button>
          <template #icon><UploadOutlined /></template>
          选择文件预览
        </a-button>
      </a-upload>
    </a-card>

    <!-- 文档预览弹窗 -->
    <DocumentPreviewModal
      v-model:open="previewVisible"
      :document="currentDocument"
      :width="1000"
      height="600px"
    />

    <!-- 凭证预览弹窗 -->
    <a-modal
      v-model:open="voucherModalVisible"
      title="凭证打印预览"
      :width="800"
      :footer="null"
    >
      <VoucherPrint :data="voucherData" :show-print="false" />
      <div class="modal-footer">
        <a-space>
          <a-button type="primary" @click="doPrintVoucher">
            <template #icon><PrinterOutlined /></template>
            打印
          </a-button>
          <a-button @click="voucherModalVisible = false">关闭</a-button>
        </a-space>
      </div>
    </a-modal>

    <!-- ID 卡预览弹窗 -->
    <a-modal
      v-model:open="idCardModalVisible"
      title="ID 卡打印预览"
      :width="500"
      :footer="null"
    >
      <div class="idcard-modal-content">
        <IdCardPrint :data="idCardData" :show-print-btn="false" />
      </div>
      <div class="modal-footer">
        <a-space>
          <a-button type="primary" @click="doPrintIdCard">
            <template #icon><PrinterOutlined /></template>
            打印
          </a-button>
          <a-button @click="idCardModalVisible = false">关闭</a-button>
        </a-space>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  PrinterOutlined,
  EyeOutlined,
  IdcardOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import DocumentPreviewModal from '@/components/document/DocumentPreview.vue'
import VoucherPrint from '@/components/document/VoucherPrint.vue'
import IdCardPrint from '@/components/document/IdCardPrint.vue'
import type { DocumentInfo, VoucherData, IdCardData } from '@/components/document/types'
import { printVoucher as printVoucherUtil, printIdCard as printIdCardUtil } from '@/utils/print'
import { downloadText, downloadCsv, downloadJson } from '@/utils/download'

// 预览相关
const previewVisible = ref(false)
const currentDocument = ref<DocumentInfo | null>(null)

// 凭证相关
const voucherModalVisible = ref(false)
const voucherData = ref<VoucherData>({
  title: '采购凭证',
  voucherNo: 'P202501260001',
  date: new Date().toISOString(),
  items: [
    { name: '办公椅', quantity: 5, unit: '把', price: 399, amount: 1995 },
    { name: '办公桌', quantity: 3, unit: '张', price: 899, amount: 2697 },
    { name: '台灯', quantity: 10, unit: '盏', price: 129, amount: 1290 },
  ],
  totalAmount: 5982,
  remark: '采购申请已批准',
})

// ID 卡相关
const idCardModalVisible = ref(false)
const idCardData = ref<IdCardData>({
  name: '张三',
  id: 'EMP202501001',
  department: '技术部',
  position: '前端工程师',
  validFrom: '2024-01-01',
  validTo: '2025-12-31',
})

// 文档预览
function previewPdf() {
  currentDocument.value = {
    id: '1',
    name: '示例文档.pdf',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  }
  previewVisible.value = true
}

function previewImage() {
  currentDocument.value = {
    id: '2',
    name: '示例图片.png',
    type: 'image',
    url: 'https://picsum.photos/800/600',
  }
  previewVisible.value = true
}

function previewWord() {
  currentDocument.value = {
    id: '3',
    name: '示例文档.docx',
    type: 'word',
    url: '#',
  }
  previewVisible.value = true
}

// 打印功能
function printVoucher() {
  printVoucherUtil(voucherData.value)
  message.success('正在打印凭证...')
}

function showVoucherPreview() {
  voucherModalVisible.value = true
}

function doPrintVoucher() {
  printVoucherUtil(voucherData.value)
  message.success('正在打印凭证...')
  voucherModalVisible.value = false
}

function printIdCard() {
  printIdCardUtil(idCardData.value, 'both')
  message.success('正在打印 ID 卡...')
}

function showIdCardPreview() {
  idCardModalVisible.value = true
}

function doPrintIdCard() {
  printIdCardUtil(idCardData.value, 'both')
  message.success('正在打印 ID 卡...')
  idCardModalVisible.value = false
}

// 下载功能
function downloadTextFile() {
  const content = `Nebula Admin 系统文档

这是示例文本文件内容。

生成时间: ${new Date().toLocaleString('zh-CN')}
`
  downloadText(content, '示例文档.txt')
  message.success('文本文件下载成功')
}

function downloadCsvFile() {
  const data = [
    { id: 1, name: '张三', department: '技术部', position: '前端工程师' },
    { id: 2, name: '李四', department: '技术部', position: '后端工程师' },
    { id: 3, name: '王五', department: '产品部', position: '产品经理' },
  ]
  downloadCsv(data, '员工列表')
  message.success('CSV 文件下载成功')
}

function downloadJsonFile() {
  const data = {
    system: 'Nebula Admin',
    version: '1.0.0',
    modules: ['AI 智能问答', '文档预览', '打印模板', '数据可视化'],
    features: {
      ai: true,
      document: true,
      print: true,
      visualization: true,
    },
  }
  downloadJson(data, '系统配置')
  message.success('JSON 文件下载成功')
}

// 上传预览
function handleBeforeUpload(file: File) {
  const url = URL.createObjectURL(file)
  const ext = file.name.split('.').pop()?.toLowerCase() || ''

  let type: DocumentInfo['type'] = 'other'
  if (ext === 'pdf') type = 'pdf'
  else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) type = 'image'

  currentDocument.value = {
    id: Date.now().toString(),
    name: file.name,
    type,
    url,
  }
  previewVisible.value = true

  return false
}
</script>

<style scoped lang="less">
.document-preview-page {
  padding: 24px;

  .ant-card {
    background: var(--card-bg);
  }

  .ant-divider {
    margin: 24px 0 16px;
  }
}

.modal-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  text-align: right;
}

.idcard-modal-content {
  display: flex;
  justify-content: center;
  padding: 24px;
  background: var(--bg-secondary);
  border-radius: 8px;
}
</style>
