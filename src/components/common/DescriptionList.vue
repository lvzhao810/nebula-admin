<template>
  <div class="description-list">
    <a-descriptions v-bind="$attrs">
      <a-descriptions-item
        v-for="item in items"
        :key="item.key"
        :label="item.label"
        :span="item.span"
      >
        <slot v-if="$slots[item.key]" :name="item.key" :record="record" />
        <template v-else>
          <span v-if="item.render" v-html="renderValue(item)" />
          <span v-else>{{ getValue(item.key) }}</span>
        </template>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script setup lang="ts">
interface DescriptionItem {
  key: string
  label: string
  span?: number
  render?: (value: any, record: any) => string
}

interface Props {
  items: DescriptionItem[]
  record: Record<string, any>
}

const props = defineProps<Props>()

const getValue = (key: string) => {
  return key.split('.').reduce((value, k) => value?.[k], props.record) ?? '-'
}

const renderValue = (item: DescriptionItem) => {
  if (!item.render) return getValue(item.key)
  return item.render(getValue(item.key), props.record)
}
</script>

<style scoped lang="less">
.description-list {
  :deep(.ant-descriptions-item-label) {
    color: #6b7280;
  }

  :deep(.ant-descriptions-item-content) {
    color: #374151;
    font-weight: 500;
  }
}
</style>
