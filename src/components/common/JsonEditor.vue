<template>
  <div class="json-editor">
    <div class="editor-header">
      <a-space>
        <a-button size="small" type="primary" @click="format">格式化</a-button>
        <a-button size="small" @click="compress">压缩</a-button>
        <a-tag v-if="!isValid" color="error">JSON 格式错误</a-tag>
      </a-space>
    </div>
    <textarea
      v-model="jsonValue"
      class="json-input"
      @input="handleInput"
      @blur="validate"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: any]
  'error': [error: string]
}>()

const jsonValue = ref(props.modelValue)
const isValid = ref(true)

function handleInput() {
  validate()
  if (isValid.value) {
    emit('update:modelValue', jsonValue.value)
    try {
      const parsed = JSON.parse(jsonValue.value)
      emit('change', parsed)
    } catch {
      // Ignore parse errors during typing
    }
  }
}

function validate() {
  try {
    JSON.parse(jsonValue.value)
    isValid.value = true
  } catch (error) {
    isValid.value = false
    emit('error', (error as Error).message)
  }
}

function format() {
  try {
    const parsed = JSON.parse(jsonValue.value)
    jsonValue.value = JSON.stringify(parsed, null, 2)
    isValid.value = true
    emit('update:modelValue', jsonValue.value)
  } catch (error) {
    isValid.value = false
  }
}

function compress() {
  try {
    const parsed = JSON.parse(jsonValue.value)
    jsonValue.value = JSON.stringify(parsed)
    isValid.value = true
    emit('update:modelValue', jsonValue.value)
  } catch (error) {
    isValid.value = false
  }
}

watch(() => props.modelValue, (val) => {
  jsonValue.value = val
})
</script>

<style scoped lang="less">
.json-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.editor-header {
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.json-input {
  width: 100%;
  min-height: 300px;
  padding: 16px;
  border: none;
  resize: vertical;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.5;
  background: #1e1e1e;
  color: #d4d4d4;
  outline: none;
}
</style>
