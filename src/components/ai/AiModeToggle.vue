<template>
  <div class="mode-toggle">
    <a-radio-group v-model:value="mode" size="small" button-style="solid">
      <a-radio-button value="work">工作</a-radio-button>
      <a-radio-button value="chat">闲聊</a-radio-button>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AssistantMode } from './types/ai'

interface Props {
  modelValue: AssistantMode
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: AssistantMode]
}>()

const mode = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped lang="less">
.mode-toggle {
  :deep(.ant-radio-group) {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
  }

  :deep(.ant-radio-button-wrapper) {
    background: transparent;
  }

  :deep(.ant-radio-button) {
    border-color: var(--border-color);

    &:not(.ant-radio-button-checked) {
      color: var(--text-secondary);
    }

    &.ant-radio-button-checked {
      background: var(--theme-gradient);
      border-color: var(--theme-primary);
      color: #fff;
    }
  }
}
</style>
