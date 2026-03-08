<template>
  <a-modal
    :open="visible"
    :title="null"
    :width="width"
    :confirm-loading="loading"
    :footer="null"
    @cancel="handleCancel"
    class="form-modal-wrapper"
    centered
    :closable="false"
  >
    <div class="form-modal-container">
      <!-- 自定义头部 -->
      <div class="modal-header">
        <div class="header-left">
          <div v-if="icon" class="header-icon">
            <component :is="getIcon(icon)" />
          </div>
          <h2 class="modal-title">{{ title }}</h2>
        </div>
        <button class="close-btn" @click="handleCancel" aria-label="关闭">
          <CloseOutlined />
        </button>
      </div>

      <!-- 表单区域 -->
      <div class="modal-body">
        <a-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          :layout="layout"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          class="form-modal-form"
        >
          <slot name="form" :form="formData" />

          <a-form-item
            v-for="item in formItems"
            :key="item.name"
            :label="item.label"
            :name="item.name"
            :class="['form-item-optimized', item.class]"
          >
            <!-- 输入框 -->
            <a-input
              v-if="item.type === 'input'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :allow-clear="item.allowClear !== false"
              size="large"
              @pressEnter="item.enter?.()"
            >
              <template v-if="item.prefix" #prefix>
                <component :is="getIcon(item.prefix)" class="input-icon" />
              </template>
            </a-input>

            <!-- 文本域 -->
            <a-textarea
              v-else-if="item.type === 'textarea'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :rows="item.rows || 4"
              :allow-clear="item.allowClear !== false"
              size="large"
              :auto-size="{ minRows: item.rows || 4, maxRows: 8 }"
            />

            <!-- 密码框 -->
            <a-input-password
              v-else-if="item.type === 'password'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              size="large"
            >
              <template v-if="item.prefix" #prefix>
                <component :is="getIcon(item.prefix)" class="input-icon" />
              </template>
            </a-input-password>

            <!-- 数字输入框 -->
            <a-input-number
              v-else-if="item.type === 'number'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :min="item.min"
              :max="item.max"
              :precision="item.precision"
              size="large"
              style="width: 100%"
            />

            <!-- 选择器 -->
            <a-select
              v-else-if="item.type === 'select'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :allow-clear="item.allowClear !== false"
              :mode="item.mode"
              :options="item.options"
              size="large"
            />

            <!-- 日期选择器 -->
            <a-date-picker
              v-else-if="item.type === 'date'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :format="item.format || 'YYYY-MM-DD'"
              size="large"
              style="width: 100%"
            />

            <!-- 日期范围选择器 -->
            <a-range-picker
              v-else-if="item.type === 'daterange'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder || ['开始日期', '结束日期']"
              :disabled="item.disabled"
              :format="item.format || 'YYYY-MM-DD'"
              size="large"
              style="width: 100%"
            />

            <!-- 时间选择器 -->
            <a-time-picker
              v-else-if="item.type === 'time'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :format="item.format || 'HH:mm:ss'"
              size="large"
              style="width: 100%"
            />

            <!-- 开关 -->
            <a-switch
              v-else-if="item.type === 'switch'"
              v-model:checked="formData[item.name]"
              :disabled="item.disabled"
              :checked-children="item.checkedChildren || '开'"
              :un-checked-children="item.unCheckedChildren || '关'"
              size="default"
            />

            <!-- 单选框 -->
            <a-radio-group
              v-else-if="item.type === 'radio'"
              v-model:value="formData[item.name]"
              :disabled="item.disabled"
              :options="item.options"
              size="large"
            />

            <!-- 复选框 -->
            <a-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model:value="formData[item.name]"
              :disabled="item.disabled"
              :options="item.options"
              size="large"
            />

            <!-- 级联选择器 -->
            <a-cascader
              v-else-if="item.type === 'cascader'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :options="item.options"
              size="large"
              style="width: 100%"
            />

            <!-- 树选择器 -->
            <a-tree-select
              v-else-if="item.type === 'tree-select'"
              v-model:value="formData[item.name]"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :tree-data="item.options"
              :field-names="item.fieldNames"
              :allow-clear="item.allowClear !== false"
              size="large"
              style="width: 100%"
              :tree-line="{ show: true }"
            />

            <!-- 自定义插槽 -->
            <slot v-else :name="`field-${item.name}`" :item="item" :form="formData" />
          </a-form-item>
        </a-form>
      </div>

      <!-- 底部按钮区 -->
      <div class="modal-footer">
        <a-space :size="16">
          <a-button @click="handleCancel" class="cancel-btn" size="large">
            <template #icon><CloseOutlined /></template>
            {{ cancelText }}
          </a-button>
          <a-button
            type="primary"
            :loading="loading"
            @click="handleOk"
            class="submit-btn"
            size="large"
          >
            <template #icon><CheckCircleOutlined /></template>
            {{ okText }}
          </a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, useTemplateRef, h } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue'
import * as Icons from '@ant-design/icons-vue'

interface FormItem {
  name: string
  label?: string
  type: string
  placeholder?: string | string[]
  disabled?: boolean
  allowClear?: boolean
  rows?: number
  min?: number
  max?: number
  precision?: number
  mode?: 'multiple' | 'tags'
  options?: any[]
  format?: string
  checkedChildren?: string
  unCheckedChildren?: string
  enter?: () => void
  class?: string
  fieldNames?: any
  prefix?: string
  suffix?: string
}

interface Props {
  visible: boolean
  title?: string
  subtitle?: string
  icon?: string
  width?: number | string
  loading?: boolean
  formData: Record<string, any>
  formItems?: FormItem[]
  rules?: Record<string, any>
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: any
  wrapperCol?: any
  okText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '表单',
  subtitle: '请填写以下信息',
  width: 600,
  loading: false,
  formItems: () => [],
  rules: () => ({}),
  layout: 'vertical',
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
  okText: '确定',
  cancelText: '取消',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:formData': [value: Record<string, any>]
  ok: []
  cancel: []
}>()

const formRef = useTemplateRef<FormInstance>('formRef')

// 获取图标组件
const getIcon = (iconName?: string) => {
  if (!iconName) return null
  const Icon = (Icons as any)[iconName]
  return Icon ? h(Icon) : null
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('ok')
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}

const resetForm = () => formRef.value?.resetFields()

watch(() => props.visible, (val) => {
  if (val) {
    nextTick(() => formRef.value?.clearValidate())
  }
})

defineExpose({
  resetForm,
  validate: () => formRef.value?.validate(),
  clearValidate: () => formRef.value?.clearValidate(),
})
</script>

<style scoped lang="less">
.form-modal-wrapper {
  :deep(.ant-modal-content) {
    border-radius: 12px !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  :deep(.ant-modal-body) {
    padding: 0 !important;
  }

  :deep(.ant-modal-close) {
    display: none;
  }
}

.form-modal-container {
  display: flex;
  flex-direction: column;
}

/* 头部区域 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--theme-gradient);
  border-bottom: 1px solid var(--theme-primary);
  border-radius: 10px 10px 0 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
  }

  .modal-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
  }
}

/* 表单主体 */
.modal-body {
  padding: 20px 24px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;

    &:hover {
      background: var(--theme-secondary);
    }
  }
}

.form-modal-form {
  .form-item-optimized {
    margin-bottom: 16px;
  }
}

/* 底部按钮区 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-radius: 0 0 10px 10px;
}
</style>

<style lang="less">
/* 非 scoped 样式，覆盖 Ant Design 默认样式 */
.form-modal-wrapper .ant-modal-content {
  padding: 0 !important;
}

.form-modal-wrapper .ant-modal-body {
  padding: 0 !important;
}

.form-modal-wrapper .ant-modal-close {
  display: none !important;
}
</style>
