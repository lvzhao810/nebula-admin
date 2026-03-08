<template>
  <a-card class="shadow-card">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <slot name="toolbar-left" />
      </div>
      <div class="flex items-center gap-3">
        <slot name="toolbar-right" />
        <a-button v-if="showRefresh" @click="handleRefresh">
          <template #icon><Icons.ReloadOutlined /></template>
          刷新
        </a-button>
        <a-dropdown
          v-if="showColumnSetting"
          :trigger="['click']"
          :overlay-style="{ zIndex: 1050 }"
          overlay-class-name="pro-table-dropdown"
        >
          <a-button>
            <template #icon><Icons.SettingOutlined /></template>
          </a-button>
          <template #overlay>
            <div class="column-setting-dropdown">
              <VueDraggable
                v-model="orderedColumns"
                item-key="key"
                handle=".drag-handle"
                :animation="200"
              >
                <template #item="{ element: col }">
                  <div class="column-item">
                    <HolderOutlined class="drag-handle" />
                    <a-checkbox :checked="isColumnVisible(col.key)" @change="toggleColumn(col.key)">
                      {{ col.title }}
                    </a-checkbox>
                  </div>
                </template>
              </VueDraggable>
              <a-divider style="margin: 8px 0;" />
              <a-button type="link" size="small" block @click="resetColumnOrder">
                <template #icon><Icons.ReloadOutlined /></template>
                重置列顺序
              </a-button>
            </div>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- 表格 -->
    <a-table
      ref="tableRef"
      v-bind="tableProps"
      :columns="computedColumns"
      :data-source="dataSource"
      :pagination="mergedPagination"
      :loading="loading"
      :row-key="rowKey"
      :scroll="{ x: scrollX }"
      :bordered="true"
      @change="handleChange"
    >
      <template v-for="slot in Object.keys($slots)" :key="slot" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </a-table>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import VueDraggable from 'vuedraggable'
import * as Icons from '@ant-design/icons-vue'
import type { TableProps, TableColumnType } from 'ant-design-vue'
import { HolderOutlined } from '@ant-design/icons-vue'

interface Props {
  columns: TableColumnType[]
  dataSource: any[]
  loading?: boolean
  pagination?: TableProps['pagination']
  rowKey?: string | ((record: any) => string)
  showToolbar?: boolean
  showRefresh?: boolean
  showColumnSetting?: boolean
  scrollX?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: 'id',
  showToolbar: true,
  showRefresh: true,
  showColumnSetting: true,
})

const emit = defineEmits<{
  refresh: []
  change: [pagination: any, filters: any, sorter: any]
}>()

const tableRef = ref<any>()

const ALWAYS_VISIBLE_KEYS = ['selection', 'action', 'expand']

// 可排序列项接口
interface ColumnItem {
  key: string
  title: string
  column: TableColumnType
}

// 保存初始列顺序和可见状态
const initialOrderedColumns: ColumnItem[] = props.columns
  .filter(col => !ALWAYS_VISIBLE_KEYS.includes(col.key as string))
  .map(col => ({
    key: (col.key as string) || (col.dataIndex as string),
    title: col.title as string,
    column: col,
  }))

const initialVisibleKeys = new Set(
  props.columns.map(col => (col.key as string) || (col.dataIndex as string))
)

// 可见列的 key 集合
const visibleColumns = ref<Set<string>>(new Set(initialVisibleKeys))

const orderedColumns = ref<ColumnItem[]>([...initialOrderedColumns])

// 重置列顺序和可见性
function resetColumnOrder() {
  orderedColumns.value = [...initialOrderedColumns]
  visibleColumns.value = new Set(initialVisibleKeys)
}

// 切换列显示/隐藏
function toggleColumn(key: string) {
  if (visibleColumns.value.has(key)) {
    visibleColumns.value.delete(key)
  } else {
    visibleColumns.value.add(key)
  }
  // 触发响应式更新
  visibleColumns.value = new Set(visibleColumns.value)
}

// 检查列是否可见
function isColumnVisible(key: string): boolean {
  return visibleColumns.value.has(key)
}

// 计算表格列：按照 orderedColumns 的顺序排列，只显示在 visibleColumns 中的列
const computedColumns = computed(() => {
  const result: TableColumnType[] = []

  // 先添加始终显示的列（如 selection、action）
  props.columns.forEach(col => {
    const key = (col.key as string) || (col.dataIndex as string)
    if (ALWAYS_VISIBLE_KEYS.includes(key)) {
      result.push(col)
    }
  })

  // 按照 orderedColumns 的顺序添加可见列
  orderedColumns.value.forEach(item => {
    if (visibleColumns.value.has(item.key)) {
      result.push(item.column)
    }
  })

  return result
})

const mergedPagination = computed(() =>
  props.pagination === false ? false : {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
    ...props.pagination,
  }
)

const tableProps = computed(() => {
  const { columns, dataSource, loading, pagination, rowKey, showToolbar, showRefresh, showColumnSetting, scrollX, ...rest } = props
  return rest
})

const handleRefresh = () => emit('refresh')

const handleChange = (pagination: any, filters: any, sorter: any) =>
  emit('change', pagination, filters, sorter)

watch(() => props.columns, (newColumns) => {
  // 获取新的列 key 列表
  const newKeys = newColumns
    .filter(col => !ALWAYS_VISIBLE_KEYS.includes(col.key as string))
    .map(col => (col.key as string) || (col.dataIndex as string))

  // 保留现有可见状态
  const currentVisible = Array.from(visibleColumns.value)
  const finalKeys = new Set([...newKeys, ...currentVisible.filter(k => newKeys.includes(k))])
  visibleColumns.value = finalKeys

  // 更新可排序列
  const newOrderedColumns: ColumnItem[] = newColumns
    .filter(col => !ALWAYS_VISIBLE_KEYS.includes(col.key as string))
    .map(col => ({
      key: (col.key as string) || (col.dataIndex as string),
      title: col.title as string,
      column: col,
    }))

  // 保留现有顺序，添加新列到末尾
  const currentKeys = new Set<string>()
  for (const c of orderedColumns.value) {
    currentKeys.add(c.key)
  }
  for (const col of newOrderedColumns) {
    if (!currentKeys.has(col.key)) {
      // @ts-expect-error - VueDraggable 类型推断问题，实际运行正常
      orderedColumns.value.push(col)
    }
  }
})

// 列宽调整功能
let resizingColumn: { element: HTMLElement; startX: number; startWidth: number } | null = null

onMounted(() => {
  initColumnResize()
})

watch(() => computedColumns.value, () => {
  nextTick(() => {
    initColumnResize()
  })
}, { flush: 'post' })

function initColumnResize() {
  nextTick(() => {
    const table = tableRef.value?.$el
    if (!table) return

    // 移除旧的拖拽手柄
    const oldHandles = table.querySelectorAll('.pro-table-resize-handle')
    oldHandles.forEach((h: Element) => h.remove())

    // 获取表头单元格
    const headerCells = table.querySelectorAll('thead th')
    headerCells.forEach((cell: Element, index: number) => {
      if (index === headerCells.length - 1) return // 最后一列不需要拖拽手柄

      const th = cell as HTMLElement

      // 创建拖拽手柄
      const handle = document.createElement('div')
      handle.className = 'pro-table-resize-handle'
      handle.style.cssText = `
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        cursor: col-resize;
        z-index: 1;
      `

      // 鼠标按下事件
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        resizingColumn = {
          element: th,
          startX: e.clientX,
          startWidth: th.offsetWidth,
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      })

      th.style.position = 'relative'
      th.appendChild(handle)
    })
  })
}

function handleMouseMove(e: MouseEvent) {
  if (!resizingColumn) return

  const diff = e.clientX - resizingColumn.startX
  const newWidth = Math.max(50, resizingColumn.startWidth + diff) // 最小宽度 50px
  resizingColumn.element.style.width = `${newWidth}px`
}

function handleMouseUp() {
  resizingColumn = null
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
</script>

<style lang="less">
.pro-table-dropdown {
  background: var(--card-bg) !important;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
}

.column-setting-dropdown {
  min-width: 180px;
  max-width: 280px;
  padding: 8px 16px 4px 16px;
}

.column-setting-dropdown .ant-divider {
  margin: 8px 0;
}

.column-setting-dropdown .ant-btn-link {
  height: 28px;
  padding: 0 8px;
  color: var(--text-secondary);

  &:hover {
    color: var(--theme-primary);
  }
}

.column-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: move;
  transition: background-color 0.2s;

  &:hover {
    background: var(--hover-bg);
  }

  .drag-handle {
    color: var(--text-secondary);
    cursor: grab;
    flex-shrink: 0;

    &:active {
      cursor: grabbing;
    }
  }

  .ant-checkbox {
    margin: 0;
    flex: 1;
  }
}

/* 拖拽时的样式 */
.column-item.sortable-ghost {
  opacity: 0.4;
  background: var(--hover-bg);
}

.column-item.sortable-drag {
  opacity: 1;
  background: var(--card-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 列宽调整手柄 */
:deep(.pro-table-resize-handle) {
  &:hover {
    background: var(--theme-primary);
    opacity: 0.5;
  }
}

:deep(thead th) {
  &:hover .pro-table-resize-handle {
    opacity: 1;
  }
}
</style>
