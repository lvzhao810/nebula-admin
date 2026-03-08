<template>
  <div :class="['chat-message', `message-${message.role}`]">
    <div class="message-content">
      <div class="message-header" v-if="message.role === 'assistant'">
        <span class="ai-badge">AI</span>
        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
      </div>
      <div class="message-text">{{ message.content }}</div>
    </div>
    <div class="message-actions" v-if="message.role === 'assistant'">
      <a-tooltip title="复制">
        <CopyOutlined @click="handleCopy" class="action-icon" />
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CopyOutlined } from '@ant-design/icons-vue'
import { message as messageApi } from 'ant-design-vue'
import type { ChatMessage } from './types/ai'

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

const emit = defineEmits<{
  copy: [text: string]
}>()

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function handleCopy() {
  emit('copy', props.message.content)
  messageApi.success('已复制到剪贴板')
}
</script>

<style scoped lang="less">
.chat-message {
  display: flex;
  gap: 8px;
  animation: message-in 0.3s ease-out;

  &.message-user {
    flex-direction: row-reverse;
  }

  .message-content {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 8px;
    line-height: 1.5;
    font-size: 14px;
  }

  &.message-user .message-content {
    background: var(--theme-primary);
    color: #fff;
    border-radius: 8px 0 8px 8px;
  }

  &.message-assistant .message-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0 8px 8px 8px;
  }
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  .ai-badge {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--theme-gradient);
    color: #fff;
  }

  .message-time {
    font-size: 11px;
    color: var(--text-tertiary);
  }
}

.message-text {
  color: var(--text-primary);
  white-space: pre-wrap;
}

.message-actions {
  margin-top: 4px;

  .action-icon {
    font-size: 12px;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 2px;

    &:hover {
      color: var(--theme-primary);
    }
  }
}

@keyframes message-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
