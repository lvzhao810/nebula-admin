<template>
  <div class="drag-kanban">
    <div
      v-for="(column, colIndex) in columns"
      :key="column.id"
      class="kanban-column"
    >
      <div class="column-header">
        <h3 class="column-title">{{ column.title }}</h3>
        <a-badge :count="column.items.length" />
      </div>

      <draggable
        :list="column.items"
        :animation="200"
        group="kanban"
        item-key="id"
        class="column-items"
        ghost-class="ghost-item"
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <div class="kanban-item">
            <slot name="item" :item="element" :index="index" :column="column">
              <div class="item-content">{{ element.title }}</div>
              <div v-if="element.description" class="item-description">
                {{ element.description }}
              </div>
            </slot>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'

interface KanbanItem {
  id: string | number
  title: string
  description?: string
  [key: string]: any
}

interface Column {
  id: string | number
  title: string
  items: KanbanItem[]
}

interface Props {
  data: Column[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:data': [data: Column[]]
  change: [data: Column[]]
}>()

const columns = ref([...props.data])

function onDragEnd() {
  emit('update:data', columns.value)
  emit('change', columns.value)
}
</script>

<style scoped lang="less">
.drag-kanban {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 0;
}

.kanban-column {
  min-width: 280px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.column-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.column-items {
  min-height: 100px;
}

.kanban-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: move;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.item-content {
  font-weight: 500;
  color: #1f2937;
}

.item-description {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
}

.ghost-item {
  opacity: 0.4;
  background: #f3f4f6;
}
</style>
