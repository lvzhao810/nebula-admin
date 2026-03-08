<template>
  <a-card class="shadow-card !mb-4">
    <a-form :model="model" :layout="layout">
      <a-row :gutter="16">
        <a-col v-for="item in items" :key="item.name" :span="item.span || 6">
          <a-form-item :label="item.label" :name="item.name">
            <!-- 输入框 -->
            <a-input
              v-if="item.type === 'input'"
              v-model:value="model[item.name]"
              :placeholder="item.placeholder"
              allow-clear
            />
            <!-- 选择器 -->
            <a-select
              v-else-if="item.type === 'select'"
              v-model:value="model[item.name]"
              :placeholder="item.placeholder"
              allow-clear
              :options="item.options"
              style="width: 100%"
            />
            <!-- 日期选择器 -->
            <a-date-picker
              v-else-if="item.type === 'date'"
              v-model:value="model[item.name]"
              :placeholder="item.placeholder"
              style="width: 100%"
            />
            <!-- 日期范围选择器 -->
            <a-range-picker
              v-else-if="item.type === 'daterange'"
              v-model:value="model[item.name]"
              :placeholder="item.placeholder || ['开始日期', '结束日期']"
              style="width: 100%"
            />
            <!-- 自定义插槽 -->
            <slot v-else :name="`field-${item.name}`" :item="item" :model="model" />
          </a-form-item>
        </a-col>
        <a-col :span="buttonSpan">
          <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                查询
              </a-button>
              <a-button @click="handleReset">
                <template #icon><ReloadOutlined /></template>
                重置
              </a-button>
              <slot name="extra" />
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'

interface SearchItem {
  name: string
  label?: string
  type: 'input' | 'select' | 'date' | 'daterange' | string
  placeholder?: string | string[]
  span?: number
  options?: any[]
}

interface Props {
  model: Record<string, any>
  items: SearchItem[]
  layout?: 'horizontal' | 'vertical' | 'inline'
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'inline',
})

const emit = defineEmits<{
  search: []
  reset: []
}>()

const buttonSpan = computed(() => {
  const lastItem = props.items[props.items.length - 1]
  const lastSpan = lastItem?.span || 6
  return Math.min(24 - (props.items.length - 1) * lastSpan, 24)
})

const handleSearch = () => emit('search')

const handleReset = () => {
  Object.keys(props.model).forEach((key) => {
    props.model[key] = Array.isArray(props.model[key]) ? [] : undefined
  })
  emit('reset')
}
</script>
