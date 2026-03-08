<template>
  <div class="code-viewer">
    <div class="code-header">
      <span class="filename">{{ filename }}</span>
      <div class="actions">
        <a-button type="text" size="small" @click="toggleExpand">
          {{ isExpanded ? '收起' : '展开完整代码' }}
        </a-button>
        <a-button type="text" size="small" aria-label="复制代码" @click="copyCode">
          <template #icon><CopyOutlined /></template>
          复制
        </a-button>
      </div>
    </div>
    <div class="code-content" :class="{ expanded: isExpanded }">
      <pre><code>{{ displayCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  code: string
  filename?: string
  coreCode?: string
}

const props = withDefaults(defineProps<Props>(), {
  filename: undefined,
  coreCode: undefined
})

const isExpanded = ref(false)

const displayCode = computed(() => {
  return isExpanded.value ? props.code : (props.coreCode || props.code.slice(0, 800) + '\n// ...')
})

const filename = computed(() => props.filename || 'ComponentDemo.vue')

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    message.success('代码已复制到剪贴板')
  } catch (error) {
    message.error('复制失败，请手动复制')
    console.error('复制代码失败:', error)
  }
}
</script>

<style scoped lang="less">
.code-viewer {
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-primary, #1f2937);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-secondary, #374151);
  border-bottom: 1px solid var(--border-color, #4b5563);

  .filename {
    font-size: 12px;
    color: var(--text-secondary, #9ca3af);
    font-family: 'Monaco', 'Menlo', monospace;
  }

  .actions {
    display: flex;
    gap: 4px;
  }
}

.code-content {
  max-height: 300px;
  overflow: hidden;
  transition: max-height 0.3s ease;

  &.expanded {
    max-height: none;
  }

  pre {
    margin: 0;
    padding: 16px;
    overflow-x: auto;

    code {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: var(--text-primary, #f3f4f6);
    }
  }
}
</style>
