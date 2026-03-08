<template>
  <div class="sortable-table">
    <a-table
      :columns="tableColumns"
      :data-source="tableData"
      :pagination="pagination"
      row-key="id"
      :custom-row="customRow"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'drag'">
          <span class="drag-handle">
            ☰
          </span>
        </template>
        <slot v-else :name="column.key" :record="record">
          {{ record[column.dataIndex] }}
        </slot>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  columns: any[]
  dataSource: any[]
  pagination?: any
}

const props = withDefaults(defineProps<Props>(), {
  pagination: false,
})

const emit = defineEmits<{
  'update:dataSource': [data: any[]]
  change: [data: any[]]
}>()

const tableData = ref<any[]>([])
const draggedItem = ref<any>(null)
const dragOverItem = ref<any>(null)
const isDragging = ref(false)

watch(() => props.dataSource, (val) => {
  tableData.value = [...val]
}, { deep: true, immediate: true })

// 添加拖拽列
const tableColumns = computed(() => {
  const hasDragColumn = props.columns.some(col => col.key === 'drag')
  if (!hasDragColumn) {
    return [{ title: '', key: 'drag', width: 50, align: 'center' }, ...props.columns]
  }
  return props.columns
})

// 自定义行，让整行可拖拽
const customRow = (record: any) => {
  return {
    class: {
      'dragging-row': draggedItem.value?.id === record.id,
      'drag-over-row': dragOverItem.value?.id === record.id && draggedItem.value?.id !== record.id,
    },
    draggable: 'true',
    style: {
      cursor: isDragging.value ? 'grabbing' : 'grab',
    },
    ondragstart: (e: DragEvent) => handleDragStart(e, record),
    ondragend: (e: DragEvent) => handleDragEnd(e),
    ondragover: (e: DragEvent) => handleDragOver(e, record),
    ondrop: (e: DragEvent) => handleDrop(e, record),
  }
}

const handleDragStart = (e: DragEvent) => {
  e.stopPropagation()
  draggedItem.value = tableData.value.find(item => {
    const tr = (e.target as HTMLElement).closest('tr')
    return tr && tr.getAttribute('data-row-key') === String(item.id)
  })
  isDragging.value = true

  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    // 设置拖拽图像
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '0.4'
  }
}

const handleDragEnd = (e: DragEvent) => {
  e.stopPropagation()
  draggedItem.value = null
  dragOverItem.value = null
  isDragging.value = false

  const target = e.currentTarget as HTMLElement
  target.style.opacity = '1'
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const record = tableData.value.find(item => {
    const tr = (e.target as HTMLElement).closest('tr')
    return tr && tr.getAttribute('data-row-key') === String(item.id)
  })

  if (record && draggedItem.value?.id !== record?.id) {
    dragOverItem.value = record
  }
}

const handleDrop = (e: DragEvent, targetRecord: any) => {
  e.preventDefault()
  e.stopPropagation()

  if (!draggedItem.value || draggedItem.value.id === targetRecord.id) {
    handleDragEnd(e)
    return
  }

  const oldIndex = tableData.value.findIndex(item => item.id === draggedItem.value.id)
  const newIndex = tableData.value.findIndex(item => item.id === targetRecord.id)

  if (oldIndex === -1 || newIndex === -1) {
    handleDragEnd(e)
    return
  }

  const newData = [...tableData.value]
  const [removed] = newData.splice(oldIndex, 1)
  newData.splice(newIndex, 0, removed)

  tableData.value = newData
  emit('update:dataSource', newData)
  emit('change', newData)

  handleDragEnd(e)
}
</script>

<style scoped lang="less">
.sortable-table {
  .drag-handle {
    color: var(--text-tertiary);
    font-size: 18px;
    user-select: none;
    display: inline-block;
    padding: 4px;
  }

  // 禁止表格内容被选中
  :deep(.ant-table) {
    user-select: none;
  }

  // 拖拽中的行样式
  :deep(.dragging-row) {
    opacity: 0.4;
    background: var(--hover-bg) !important;
  }

  // 拖拽悬停的行样式
  :deep(.drag-over-row) {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-top: 2px solid var(--theme-primary);
      border-bottom: 2px solid var(--theme-primary);
      pointer-events: none;
    }
  }

  // 可拖拽行的样式
  :deep(.ant-table-tbody > tr[draggable='true']) {
    transition: background-color 150ms ease-out, opacity 150ms ease-out;

    &:hover {
      background: var(--hover-bg) !important;
    }

    &:active {
      cursor: grabbing;
    }
  }

  // 禁止拖拽时的高亮选中文本
  :deep(.ant-table-tbody > tr *) {
    pointer-events: none;
  }

  // 恢复交互元素的指针事件
  :deep(.ant-table-tbody > tr .drag-handle),
  :deep(.ant-table-tbody > tr a),
  :deep(.ant-table-tbody > tr button) {
    pointer-events: auto;
  }
}
</style>
