<template>
  <div class="idcard-container">
    <!-- 正面 -->
    <div class="idcard idcard-front" ref="frontRef">
      <div class="idcard-header">
        <div class="logo">🏢</div>
        <h2 class="company-name">Nebula Admin</h2>
      </div>

      <div class="idcard-body">
        <div class="photo-section">
          <img
            v-if="data.photo"
            :src="data.photo"
            alt="证件照"
            class="photo"
          />
          <div v-else class="photo-placeholder">
            <UserOutlined class="placeholder-icon" />
          </div>
        </div>

        <div class="info-section">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ data.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">编号：</span>
            <span class="value">{{ data.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">部门：</span>
            <span class="value">{{ data.department }}</span>
          </div>
          <div class="info-item">
            <span class="label">职位：</span>
            <span class="value">{{ data.position }}</span>
          </div>
        </div>
      </div>

      <div class="idcard-footer">
        <div class="validity">
          <span>有效期：{{ formatDate(data.validFrom) }} 至 {{ formatDate(data.validTo) }}</span>
        </div>
      </div>
    </div>

    <!-- 背面 -->
    <div class="idcard idcard-back" ref="backRef">
      <div class="idcard-header">
        <h3 class="back-title">使用说明</h3>
      </div>

      <div class="idcard-body">
        <ul class="instructions">
          <li>本卡是身份识别的重要凭证，请妥善保管</li>
          <li>本卡仅限本人使用，不得转借他人</li>
          <li>如遗失请及时挂失补办</li>
          <li>离岗时需交回本卡</li>
        </ul>
      </div>

      <div class="idcard-footer">
        <div class="barcode">
          <div class="barcode-lines"></div>
          <span class="barcode-text">{{ data.id }}</span>
        </div>
      </div>
    </div>

    <!-- 打印按钮 -->
    <div v-if="showPrintBtn" class="print-actions">
      <a-space>
        <a-button type="primary" @click="printFront">
          <template #icon><PrinterOutlined /></template>
          打印正面
        </a-button>
        <a-button @click="printBack">
          <template #icon><PrinterOutlined /></template>
          打印背面
        </a-button>
        <a-button @click="printBoth">
          <template #icon><PrinterOutlined /></template>
          打印双面
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserOutlined, PrinterOutlined } from '@ant-design/icons-vue'
import type { IdCardData } from './types'

interface Props {
  data: IdCardData
  showPrintBtn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPrintBtn: true,
})

const frontRef = ref<HTMLElement>()
const backRef = ref<HTMLElement>()

// 格式化日期
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 打印内容
function printContent(contentRef: any) {
  if (!contentRef.value) return

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const content = contentRef.value.innerHTML
  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('')
      } catch {
        return ''
      }
    })
    .join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>打印ID卡</title>
        <style>
          ${styles}
          @media print {
            @page { margin: 0; size: 85.6mm 54mm; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="idcard idcard-front">${content}</div>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
  }
}

// 打印正面
function printFront() {
  printContent(frontRef)
}

// 打印背面
function printBack() {
  printContent(backRef)
}

// 打印双面
function printBoth() {
  printFront()
  setTimeout(() => {
    printBack()
  }, 1000)
}
</script>

<style scoped lang="less">
.idcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
}

.idcard {
  width: 323px; // 85.6mm
  height: 204px; // 54mm
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
  }
}

.idcard-header {
  text-align: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;

  .logo {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .company-name {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .back-title {
    margin: 0;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
  }
}

.idcard-body {
  flex: 1;
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 1;

  .photo-section {
    flex-shrink: 0;

    .photo {
      width: 64px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .photo-placeholder {
      width: 64px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder-icon {
        font-size: 28px;
        opacity: 0.7;
      }
    }
  }

  .info-section {
    flex: 1;

    .info-item {
      margin-bottom: 6px;
      font-size: 12px;

      .label {
        opacity: 0.8;
        margin-right: 4px;
      }

      .value {
        font-weight: 500;
      }
    }
  }

  .instructions {
    margin: 0;
    padding-left: 16px;
    font-size: 11px;
    line-height: 1.8;

    li {
      opacity: 0.9;
    }
  }
}

.idcard-footer {
  text-align: center;
  font-size: 10px;
  opacity: 0.8;
  position: relative;
  z-index: 1;

  .validity {
    margin-bottom: 8px;
  }

  .barcode {
    .barcode-lines {
      height: 24px;
      background: repeating-linear-gradient(
        90deg,
        #fff 0px,
        #fff 2px,
        transparent 2px,
        transparent 4px,
        #fff 4px,
        #fff 5px,
        transparent 5px,
        transparent 7px
      );
      margin-bottom: 4px;
    }

    .barcode-text {
      font-size: 10px;
      letter-spacing: 2px;
    }
  }
}

.idcard-back {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.print-actions {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

/* 打印样式 */
@media print {
  .idcard {
    box-shadow: none;
    page-break-inside: avoid;
  }

  .print-actions {
    display: none;
  }
}
</style>
