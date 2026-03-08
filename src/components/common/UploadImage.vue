<template>
  <div class="upload-image">
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
      :max-count="maxCount"
      :accept="accept"
      :disabled="disabled"
      @preview="handlePreview"
      @remove="handleRemove"
    >
      <div v-if="fileList.length < maxCount">
        <PlusOutlined />
        <div class="mt-2">{{ uploadText }}</div>
      </div>
    </a-upload>

    <!-- 图片预览 -->
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="previewVisible = false">
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

interface Props {
  value?: string | string[]
  maxCount?: number
  accept?: string
  disabled?: boolean
  uploadText?: string
  maxSize?: number // MB
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 1,
  accept: 'image/*',
  disabled: false,
  uploadText: '上传图片',
  maxSize: 5,
})

const emit = defineEmits<{
  'update:value': [value: string | string[]]
  change: [value: string | string[]]
  success: [file: any]
}>()

const fileList = ref<any[]>([])
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

// 初始化文件列表
const initFileList = (value: string | string[] | undefined) => {
  fileList.value = []
  if (value) {
    const urls = Array.isArray(value) ? value : [value]
    fileList.value = urls.map((url, index) => ({
      uid: `${index}`,
      name: `image-${index}`,
      status: 'done',
      url,
    }))
  }
}

// 监听 value 变化
watch(() => props.value, (val) => {
  initFileList(val)
}, { immediate: true })

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    alert('只能上传图片文件！')
    return false
  }

  const isLtSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLtSize) {
    alert(`图片大小不能超过 ${props.maxSize}MB！`)
    return false
  }

  return true
}

// 自定义上传
const handleUpload = (options: any) => {
  const { file } = options

  // 模拟上传，实际项目中替换为真实的上传接口
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    // 更新文件状态
    const fileItem = fileList.value.find((f) => f.uid === file.uid)
    if (fileItem) {
      fileItem.url = reader.result as string
      fileItem.status = 'done'
      emitChange()
      emit('success', file)
    }
  }
}

// 移除文件
const handleRemove: UploadProps['onRemove'] = () => {
  emitChange()
}

// 预览
const handlePreview: UploadProps['onPreview'] = (file) => {
  previewImage.value = file.url || file.thumbUrl
  previewVisible.value = true
  previewTitle.value = file.name || '图片预览'
}

// 触发变化事件
const emitChange = () => {
  const urls = fileList.value
    .filter((file) => file.status === 'done' && file.url)
    .map((file) => file.url)

  const value = props.maxCount === 1 ? (urls[0] || '') : urls
  emit('update:value', value)
  emit('change', value)
}

// 暴露方法
defineExpose({
  clear: () => {
    fileList.value = []
    emitChange()
  },
})
</script>
