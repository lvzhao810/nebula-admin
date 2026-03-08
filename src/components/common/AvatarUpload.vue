<template>
  <div class="avatar-upload">
    <a-upload
      :before-upload="beforeUpload"
      :show-upload-list="false"
      accept="image/*"
    >
      <div class="avatar-area">
        <img v-if="value" :src="value" class="avatar-image" />
        <div v-else class="avatar-placeholder">
          <PlusOutlined />
          <span>上传头像</span>
        </div>
        <div class="avatar-mask">
          <span>更换头像</span>
        </div>
      </div>
    </a-upload>

    <a-modal
      v-model:open="cropVisible"
      title="裁剪头像"
      :width="500"
      @ok="handleCrop"
      @cancel="cropVisible = false"
    >
      <div class="crop-container">
        <img ref="cropImageRef" :src="previewImage" class="crop-image" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  value?: string
  maxSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 2,
})

const emit = defineEmits<{
  'update:value': [value: string]
  change: [value: string]
}>()

const cropVisible = ref(false)
const previewImage = ref('')
const cropImageRef = ref<HTMLImageElement>()

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }

  const isLtSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLtSize) {
    message.error(`图片大小不能超过 ${props.maxSize}MB`)
    return false
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    previewImage.value = reader.result as string
    cropVisible.value = true
  }

  return false
}

function handleCrop() {
  // 这里应该实现实际的裁剪功能
  // 简化版本直接使用原图
  emit('update:value', previewImage.value)
  emit('change', previewImage.value)
  cropVisible.value = false
}
</script>

<style scoped lang="less">
.avatar-upload {
  .avatar-area {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 2px dashed #d9d9d9;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color, #6366f1);

      .avatar-mask {
        opacity: 1;
      }
    }
  }

  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #9ca3af;
    font-size: 14px;

    .anticon {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }

  .avatar-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}

.crop-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.crop-image {
  max-width: 100%;
  max-height: 400px;
}
</style>
