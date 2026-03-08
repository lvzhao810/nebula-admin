<template>
  <div class="drag-list">
    <draggable
      :list="listData"
      :animation="200"
      item-key="id"
      ghost-class="ghost-item"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div class="drag-item">
          <span class="drag-handle">☰</span>
          <slot name="item" :item="element" :index="index">
            <span class="item-content">{{ element.text }}</span>
          </slot>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

interface Item {
  id: string | number
  text: string
  [key: string]: any
}

interface Props {
  list: Item[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:list': [list: Item[]]
  change: [list: Item[]]
}>()

const listData = ref([...props.list])

watch(() => props.list, (val) => {
  listData.value = [...val]
}, { deep: true })

function onDragEnd() {
  emit('update:list', listData.value)
  emit('change', listData.value)
}
</script>

<style scoped lang="less">
.drag-list {
  .drag-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: move;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--primary-color, #6366f1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  .drag-handle {
    margin-right: 12px;
    color: #9ca3af;
    cursor: grab;
  }

  .ghost-item {
    opacity: 0.4;
    background: #f3f4f6;
  }
}
</style>
