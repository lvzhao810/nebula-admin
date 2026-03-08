<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <a-space>
        <a-button size="small" @click="execCommand('bold')">
          <template #icon><BoldOutlined /></template>
        </a-button>
        <a-button size="small" @click="execCommand('italic')">
          <template #icon><ItalicOutlined /></template>
        </a-button>
        <a-button size="small" @click="execCommand('underline')">
          <template #icon><UnderlineOutlined /></template>
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" @click="execCommand('insertUnorderedList')">
          <UnorderedListOutlined />
        </a-button>
        <a-button size="small" @click="execCommand('insertOrderedList')">
          <OrderedListOutlined />
        </a-button>
        <a-divider type="vertical" />
        <a-button size="small" @click="execCommand('justifyLeft')">
          <AlignLeftOutlined />
        </a-button>
        <a-button size="small" @click="execCommand('justifyCenter')">
          <AlignCenterOutlined />
        </a-button>
        <a-button size="small" @click="execCommand('justifyRight')">
          <AlignRightOutlined />
        </a-button>
      </a-space>
    </div>
    <div
      ref="editorRef"
      class="editor-content"
      contenteditable="true"
      @input="handleInput"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from '@ant-design/icons-vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorRef = ref<HTMLDivElement>()

function execCommand(command: string, value: string | undefined = undefined) {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
}

function handleInput() {
  const html = editorRef.value?.innerHTML || ''
  emit('update:modelValue', html)
}

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue
  }
})

watch(() => props.modelValue, (val) => {
  if (editorRef.value && editorRef.value.innerHTML !== val) {
    editorRef.value.innerHTML = val
  }
})
</script>

<style scoped lang="less">
.rich-text-editor {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.editor-content {
  padding: 16px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  background: #fff;

  &:focus {
    outline: none;
  }
}
</style>
