<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <div class="editor-pane">
        <div class="pane-header">Markdown</div>
        <textarea
          v-model="markdown"
          class="markdown-input"
          @input="handleInput"
        ></textarea>
      </div>
      <div class="preview-pane">
        <div class="pane-header">预览</div>
        <div class="markdown-preview" v-html="renderedHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const markdown = ref(props.modelValue)

const renderedHtml = computed(() => {
  return marked(markdown.value)
})

function handleInput() {
  emit('update:modelValue', markdown.value)
}

watch(() => props.modelValue, (val) => {
  markdown.value = val
})
</script>

<style scoped lang="less">
.markdown-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.editor-container {
  display: flex;
  min-height: 400px;
}

.editor-pane,
.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-pane {
  border-right: 1px solid #e5e7eb;
}

.pane-header {
  padding: 8px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
}

.markdown-input {
  flex: 1;
  padding: 16px;
  border: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.markdown-preview {
  flex: 1;
  padding: 16px;
  overflow-y: auto;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin-top: 0;
  }

  :deep(code) {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  :deep(pre) {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }
}
</style>
