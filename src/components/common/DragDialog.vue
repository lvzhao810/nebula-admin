<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :width="width"
    :footer="null"
    wrap-class-name="drag-dialog-modal"
  >
    <div
      class="drag-dialog-header"
      @mousedown="startDrag"
    >
      <slot name="header">
        <span class="drag-title">{{ title }}</span>
      </slot>
    </div>
    <div class="drag-dialog-body">
      <slot />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  open: boolean
  title?: string
  width?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  width: 600,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const visible = ref(props.open)
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const offsetPos = ref({ x: 0, y: 0 })

watch(() => props.open, (val) => {
  visible.value = val
  if (!val) {
    offsetPos.value = { x: 0, y: 0 }
  }
})

watch(visible, (val) => {
  emit('update:open', val)
})

function startDrag(e: MouseEvent) {
  isDragging.value = true
  startPos.value = { x: e.clientX, y: e.clientY }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return

  const dx = e.clientX - startPos.value.x
  const dy = e.clientY - startPos.value.y

  offsetPos.value = { x: offsetPos.value.x + dx, y: offsetPos.value.y + dy }
  startPos.value = { x: e.clientX, y: e.clientY }

  updateModalPosition()
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

function updateModalPosition() {
  const modal = document.querySelector('.drag-dialog-modal .ant-modal')
  if (modal) {
    (modal as HTMLElement).style.transform = `translate(${offsetPos.value.x}px, ${offsetPos.value.y}px)`
  }
}
</script>

<style scoped lang="less">
.drag-dialog-header {
  padding: 16px;
  cursor: move;
  user-select: none;
  border-bottom: 1px solid #f0f0f0;
}

.drag-title {
  font-weight: 600;
  font-size: 16px;
}

.drag-dialog-body {
  padding: 16px;
}
</style>

<style>
.drag-dialog-modal .ant-modal-content {
  overflow: visible;
}

.drag-dialog-modal .ant-modal-header {
  display: none;
}
</style>
