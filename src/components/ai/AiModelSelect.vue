<template>
  <a-select
    v-model:value="model"
    size="small"
    style="width: 140px"
    :loading="isLoading"
  >
    <template #suffixIcon>
      <RobotOutlined />
    </template>
    <a-select-option
      v-for="config in models"
      :key="config.id"
      :value="config.id"
    >
      <div class="model-option">
        <span class="model-name">{{ config.name }}</span>
        <span class="model-provider">{{ config.provider }}</span>
      </div>
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import type { AiModel } from './types/ai'
import { AI_MODELS } from './config/models'

interface Props {
  modelValue: AiModel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: AiModel]
}>()

const isLoading = ref(false)

const models = computed(() => Object.values(AI_MODELS))

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped lang="less">
.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .model-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .model-provider {
    font-size: 11px;
    color: var(--text-tertiary);
    padding: 1px 4px;
    border-radius: 3px;
    background: var(--bg-tertiary);
  }
}

:deep(.ant-select-selector) {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

:deep(.ant-select-selection-item) {
  color: var(--text-primary);
}

:deep(.ant-select-arrow) {
  color: var(--text-secondary);
}
</style>
