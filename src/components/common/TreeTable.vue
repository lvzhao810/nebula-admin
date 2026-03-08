<template>
  <div class="tree-table">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :default-expand-all-rows="false"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <slot :name="column.dataIndex" :record="record">
          {{ record[column.dataIndex] }}
        </slot>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TreeNode {
  id: string | number
  children?: TreeNode[]
  [key: string]: any
}

interface Props {
  columns: any[]
  dataSource: TreeNode[]
}

const props = defineProps<Props>()

const columns = computed(() => {
  const [firstColumn, ...rest] = props.columns
  return [
    {
      ...firstColumn,
      customRender: ({ record }: any) => record[firstColumn.dataIndex as string],
    },
    ...rest,
  ]
})
</script>

<style scoped lang="less">
.tree-table {
  :deep(.ant-table-tbody .ant-table-row-expand-icon) {
    color: var(--primary-color, #6366f1);
  }
}
</style>
