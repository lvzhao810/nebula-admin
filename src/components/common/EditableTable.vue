<template>
  <div class="editable-table">
    <a-table
      :columns="tableColumns"
      :data-source="localDataSource"
      :pagination="pagination"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <div v-if="column.editable && editingKey === `${record.id}_${column.dataIndex}`" class="editable-cell">
          <a-input
            :value="editValue"
            @update:value="editValue = $event"
            @blur="handleSave(record, column)"
            @pressEnter="handleSave(record, column)"
          />
        </div>
        <div v-else class="cell-content" @click="handleCellClick(record, column)">
          <slot :name="String(column.dataIndex)" :record="record">
            {{ record[column.dataIndex] }}
          </slot>
        </div>
      </template>
      <template #action="{ record }">
        <div class="action-buttons">
          <template v-if="editingKey === record.id">
            <a-button size="small" type="link" @click="handleSave(record)">保存</a-button>
            <a-button size="small" type="link" @click="handleCancel">取消</a-button>
          </template>
          <template v-else>
            <a-button size="small" type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button size="small" type="link" danger @click="handleRemove(record)">删除</a-button>
          </template>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed, watch, nextTick } from 'vue'

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

const editingKey = ref<string>('')
const originalData = ref<any>(null)
const editValue = ref('')
const editingColumn = ref<any>(null)
const localDataSource = ref<any[]>([])

// 初始化本地数据
const initializeDataSource = () => {
  localDataSource.value = (props.dataSource || []).map(item => ({ ...item }))
}

// 监听 props.dataSource 变化
watch(() => props.dataSource, () => {
  initializeDataSource()
}, { immediate: true, deep: true })

// 添加操作列
const tableColumns = computed(() => {
  const cols: any[] = props.columns || []
  const hasActionColumn = cols.some(col => col.key === 'action')
  if (!hasActionColumn) {
    return [...cols, { title: '操作', key: 'action', width: 150 }]
  }
  return cols
})

const emitChanges = () => {
  emit('update:dataSource', localDataSource.value)
  emit('change', localDataSource.value)
}

const handleCellClick = (record: any, column: any) => {
  if (column.editable) {
    handleEdit(record, column)
  }
}

const handleEdit = (record: any, column?: any) => {
  originalData.value = { ...record }
  editingColumn.value = column || props.columns.find((col: any) => col.editable)
  editingKey.value = record.id.toString()

  if (editingColumn.value) {
    editValue.value = record[editingColumn.value.dataIndex] || ''
    editingKey.value = `${record.id}_${editingColumn.value.dataIndex}`
  }

  nextTick(() => {
    const input = document.querySelector('.editable-cell input') as HTMLInputElement
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const handleSave = (record: any, column?: any) => {
  const col = column || editingColumn.value
  if (!col || !originalData.value) return

  const index = localDataSource.value.findIndex((item) => item.id === record.id)
  if (index !== -1) {
    localDataSource.value[index] = {
      ...localDataSource.value[index],
      [col.dataIndex]: editValue.value
    }
  }

  editingKey.value = ''
  originalData.value = null
  editingColumn.value = null
  emitChanges()
}

const handleCancel = () => {
  if (originalData.value) {
    const index = localDataSource.value.findIndex((item) => item.id === originalData.value.id)
    if (index !== -1) {
      localDataSource.value[index] = { ...originalData.value }
    }
  }
  editingKey.value = ''
  originalData.value = null
  editingColumn.value = null
}

const handleRemove = (record: any) => {
  const index = localDataSource.value.findIndex((item) => item.id === record.id)
  if (index !== -1) {
    localDataSource.value.splice(index, 1)
    emitChanges()
  }
}
</script>

<style scoped lang="less">
.editable-table {
  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .editable-cell {
    padding: 4px 0;
  }

  .cell-content {
    cursor: pointer;
    padding: 4px 0;
    border-radius: 4px;
    transition: background-color 150ms ease-out;

    &:hover {
      background: var(--hover-bg);
    }
  }
}
</style>
