<template>
  <div class="voucher-print" ref="printRef">
    <!-- 凭证头部 -->
    <div class="voucher-header">
      <h1 class="voucher-title">{{ data.title }}</h1>
      <div class="voucher-info">
        <div class="info-row">
          <span class="label">凭证编号：</span>
          <span class="value">{{ data.voucherNo }}</span>
        </div>
        <div class="info-row">
          <span class="label">打印日期：</span>
          <span class="value">{{ formatDate(data.date) }}</span>
        </div>
      </div>
    </div>

    <!-- 凭证内容 -->
    <div class="voucher-content">
      <table class="voucher-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>名称</th>
            <th>数量</th>
            <th>单位</th>
            <th>单价</th>
            <th>金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.unit }}</td>
            <td>{{ formatPrice(item.price) }}</td>
            <td>{{ formatPrice(item.amount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="5" class="total-label">合计</td>
            <td class="total-amount">{{ formatPrice(data.totalAmount) }}</td>
          </tr>
        </tfoot>
      </table>

      <!-- 备注 -->
      <div v-if="data.remark" class="voucher-remark">
        <span class="remark-label">备注：</span>
        <span class="remark-text">{{ data.remark }}</span>
      </div>
    </div>

    <!-- 凭证尾部 -->
    <div class="voucher-footer">
      <div class="footer-item">
        <span class="label">制单人：</span>
        <span class="value">{{ currentUser }}</span>
      </div>
      <div class="footer-item">
        <span class="label">审核人：</span>
        <span class="value">_____________</span>
      </div>
      <div class="footer-item">
        <span class="label">打印时间：</span>
        <span class="value">{{ formatDateTime(new Date()) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VoucherData } from './types'
import { useUserStore } from '@/stores/user'

interface Props {
  data: VoucherData
  showPrint?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPrint: true,
})

const emit = defineEmits<{
  print: []
}>()

const printRef = ref<HTMLElement>()
const userStore = useUserStore()
const currentUser = ref(userStore.userInfo?.username || '管理员')

// 格式化日期
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 格式化日期时间
function formatDateTime(date: Date): string {
  return date.toLocaleString('zh-CN')
}

// 格式化价格
function formatPrice(price: number): string {
  return '¥' + price.toFixed(2)
}
</script>

<style scoped lang="less">
.voucher-print {
  padding: 24px;
  background: #fff;
  color: #000;
  font-family: 'SimSun', serif;
}

.voucher-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #000;

  .voucher-title {
    font-size: 22px;
    font-weight: bold;
    margin: 0 0 16px;
  }

  .voucher-info {
    display: flex;
    justify-content: center;
    gap: 32px;

    .info-row {
      .label {
        margin-right: 4px;
      }
    }
  }
}

.voucher-content {
  margin-bottom: 24px;

  .voucher-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;

    th,
    td {
      border: 1px solid #000;
      padding: 8px 12px;
      text-align: center;
    }

    th {
      background: #f5f5f5;
      font-weight: bold;
    }

    .total-row {
      font-weight: bold;

      .total-label {
        text-align: right;
        padding-right: 16px;
      }

      .total-amount {
        font-size: 16px;
      }
    }
  }

  .voucher-remark {
    padding: 8px 12px;
    border: 1px dashed #ccc;
    background: #fafafa;

    .remark-label {
      font-weight: bold;
      margin-right: 4px;
    }
  }
}

.voucher-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #ddd;

  .footer-item {
    .label {
      margin-right: 4px;
    }

    .value {
      display: inline-block;
      min-width: 100px;
      border-bottom: 1px solid #000;
    }
  }
}

/* 打印样式 */
@media print {
  .voucher-print {
    padding: 0;
    box-shadow: none;
  }

  .voucher-footer .value {
    border-bottom: none;
  }
}
</style>
