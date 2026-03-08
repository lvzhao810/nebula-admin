<template>
  <div
    v-if="isOpen"
    class="chat-window"
    :style="{ width: '420px', height: '580px' }"
  >
    <!-- 顶部栏 -->
    <div class="chat-header">
      <div class="header-left">
        <div class="ai-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.66 6 15 8.34 15 12C15 15.66 13.66 18 12 18C10.34 18 9 15.66 9 12C9 8.34 10.34 6 12 6ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="url(#gradient)"></path>
            <circle cx="12" cy="12" r="3" fill="white"></circle>
            <defs>
              <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--theme-primary)"></stop>
                <stop offset="1" stop-color="var(--theme-secondary)"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="header-text">
          <h3 class="ai-title">AI Assistant</h3>
          <div class="mode-badge" :class="`mode-${currentMode}`">
            <span class="mode-icon">{{ currentMode === 'work' ? '💼' : '💬' }}</span>
            <span class="mode-text">{{ currentMode === 'work' ? '工作模式' : '闲聊模式' }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="icon-btn" @click="exportChat" title="导出对话">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
          </svg>
        </button>
        <button class="icon-btn" @click="clearChat" title="清空对话">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
          </svg>
        </button>
        <button class="icon-btn close-btn" @click="$emit('close')" title="最小化">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="chat-toolbar">
      <div class="mode-switcher">
        <button
          :class="['mode-option', { active: currentMode === 'work' }]"
          @click="currentMode = 'work'"
        >
          <span class="mode-icon">💼</span>
          <span>工作</span>
        </button>
        <button
          :class="['mode-option', { active: currentMode === 'chat' }]"
          @click="currentMode = 'chat'"
        >
          <span class="mode-icon">💬</span>
          <span>闲聊</span>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <AiModelSelect v-model="currentModel" class="model-select" />

      <button class="config-btn" @click="showApiKeyModal = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m6-6h-6m6 0h6"></path>
        </svg>
        <span>配置</span>
      </button>
    </div>

    <!-- 对话区 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-avatar">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="emptyGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--theme-primary)"></stop>
                <stop offset="1" stop-color="var(--theme-secondary)"></stop>
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#emptyGradient)" opacity="0.6"></circle>
          </svg>
        </div>
        <h3 class="empty-title">你好！我是 AI Assistant</h3>
        <p class="empty-hint">{{ currentMode === 'work' ? '有什么可以帮助你的？' : '想聊点什么？' }}</p>
      </div>

      <AiChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @copy="copyMessage"
      />

      <div v-if="isTyping" class="typing-indicator">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-input-area">
      <div class="input-wrapper">
        <a-textarea
          v-model:value="inputText"
          :placeholder="currentMode === 'work' ? '输入你的问题...' : '想聊点什么？'"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          :disabled="isLoading"
          @keydown.enter.exact="handleSend"
          class="chat-textarea"
        />
        <button
          :class="['send-button', { enabled: inputText?.trim() && !isLoading }]"
          :disabled="!inputText?.trim() || isLoading"
          @click="handleSend"
        >
          <svg v-if="!isLoading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13"></polygon>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="loading-spinner">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- API Key 配置弹窗 -->
    <a-modal
      v-model:open="showApiKeyModal"
      title="配置 API Key"
      @ok="handleSaveApiKey"
      width="480px"
      :footer="null"
    >
      <div class="api-config-modal">
        <div class="modal-info">
          <div class="info-icon">ℹ️</div>
          <div class="info-content">
            <h4>使用 AI 助手需要配置 API Key</h4>
            <p>选择您喜欢的 AI 模型，配置后即可开始对话</p>
          </div>
        </div>

        <div class="model-selection">
          <h4>选择模型</h4>
          <div class="model-cards">
            <div
              :class="['model-card', { selected: apiKeyModel === 'qwen' }]"
              @click="apiKeyModel = 'qwen'; loadCurrentApiKey()"
            >
              <div class="card-icon">🌟</div>
              <div class="card-info">
                <h5>通义千问</h5>
                <span class="card-badge">推荐</span>
                <p>阿里云百炼平台，有免费额度</p>
              </div>
            </div>

            <div
              :class="['model-card', { selected: apiKeyModel === 'zhipu' }]"
              @click="apiKeyModel = 'zhipu'; loadCurrentApiKey()"
            >
              <div class="card-icon">🧠</div>
              <div class="card-info">
                <h5>智谱 GLM</h5>
                <span class="card-badge">热门</span>
                <p>智谱开放平台，性能优异</p>
              </div>
            </div>
          </div>
        </div>

        <div class="api-input-section">
          <h4>API Key</h4>
          <a-input
            v-model:value="currentApiKey"
            type="password"
            placeholder="请输入 API Key"
            autocomplete="off"
            size="large"
          >
            <template #prefix>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15 7m0 0l3 3"></path>
              </svg>
            </template>
          </a-input>

          <div class="api-help">
            <p v-if="apiKeyModel === 'qwen'">
              获取地址：<a href="https://dashscope.aliyun.com/" target="_blank">阿里云百炼平台</a>
              <span class="help-arrow">→</span>
              <span>开通服务 → 创建 API Key</span>
            </p>
            <p v-else-if="apiKeyModel === 'zhipu'">
              获取地址：<a href="https://open.bigmodel.cn/" target="_blank">智谱开放平台</a>
              <span class="help-arrow">→</span>
              <span>注册登录 → 获取 API Key</span>
            </p>
          </div>
        </div>

        <div class="modal-actions">
          <a-button @click="showApiKeyModal = false">取消</a-button>
          <a-button type="primary" @click="handleSaveApiKey" :disabled="!currentApiKey?.trim()">
            保存配置
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, triggerRef, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import AiChatMessage from './AiChatMessage.vue'
import AiModelSelect from './AiModelSelect.vue'
import { useAiChat } from '@/composables/useAiChat'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

// 使用 AI Chat composable 并使用 toRefs 解构
const chatState = useAiChat()
const { messages, currentMode, currentModel, isLoading, isTyping } = toRefs(chatState)

// 输入框状态
const inputText = ref('')
const messagesContainer = ref<HTMLElement>()

// API Key 配置
const showApiKeyModal = ref(false)
const apiKeyModel = ref<'qwen' | 'zhipu'>('zhipu')
const currentApiKey = ref('')

// 加载当前模型的 API Key
function loadCurrentApiKey() {
  const keys = JSON.parse(localStorage.getItem('ai-api-keys') || '{}')
  currentApiKey.value = keys[apiKeyModel.value] || ''
}

// 保存 API Key
function handleSaveApiKey() {
  if (!currentApiKey.value.trim()) {
    message.warning('请输入 API Key')
    return
  }

  const keys = JSON.parse(localStorage.getItem('ai-api-keys') || '{}')
  keys[apiKeyModel.value] = currentApiKey.value.trim()
  localStorage.setItem('ai-api-keys', JSON.stringify(keys))

  currentModel.value = apiKeyModel.value
  message.success(`API Key 已保存，已切换到 ${apiKeyModel.value === 'qwen' ? '通义千问' : '智谱 GLM'}`)

  showApiKeyModal.value = false
}

// 监听当前模型变化
watch(() => currentModel.value, (newModel) => {
  apiKeyModel.value = newModel as 'qwen' | 'zhipu'
  loadCurrentApiKey()
})

// 发送消息
async function handleSend() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  inputText.value = ''
  triggerRef(inputText)
  await nextTick()
  await chatState.sendMessage(text)
  scrollToBottom()
}

// 复制消息
function copyMessage(text: string) {
  navigator.clipboard.writeText(text)
  message.success('已复制到剪贴板')
}

// 清空对话
function clearChat() {
  chatState.clearChat()
  message.success('对话已清空')
}

// 导出对话
function exportChat() {
  if (messages.value.length === 0) {
    message.warning('没有可导出的对话')
    return
  }

  const content = chatState.exportChat()
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-chat-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)

  message.success('对话记录已导出')
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 监听消息变化，自动滚动
watch(() => messages.value, () => {
  scrollToBottom()
}, { flush: 'post', deep: true })

// 组件挂载时配置智谱
onMounted(() => {
  const keys = JSON.parse(localStorage.getItem('ai-api-keys') || '{}')
  if (keys.zhipu) {
    currentModel.value = 'zhipu'
    apiKeyModel.value = 'zhipu'
    currentApiKey.value = keys.zhipu
  }
})
</script>

<style scoped lang="less">
.chat-window {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 1001;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ========== 顶部栏 ========== */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: var(--theme-gradient);
    opacity: 0.3;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;

  .ai-avatar {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--theme-gradient);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 14px;
      background: var(--theme-gradient);
      opacity: 0.3;
      filter: blur(8px);
      z-index: -1;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .header-text {
    .ai-title {
      font-size: 15px;
      font-weight: 600;
      background: var(--theme-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -0.3px;
    }

    .mode-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
      margin-top: 4px;

      &.mode-work {
        background: rgba(99, 102, 241, 0.1);
        color: var(--theme-primary);
        border: 1px solid rgba(99, 102, 241, 0.2);
      }

      &.mode-chat {
        background: rgba(168, 85, 247, 0.1);
        color: var(--theme-secondary);
        border: 1px solid rgba(168, 85, 247, 0.2);
      }

      .mode-icon {
        font-size: 12px;
      }
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;

  .icon-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: var(--hover-bg);
      color: var(--theme-primary);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &.close-btn:hover {
      background: rgba(239, 68, 68, 0.08);
      color: #ef4444;
    }
  }
}

/* ========== 工具栏 ========== */
.chat-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);

  .mode-switcher {
    display: flex;
    background: var(--hover-bg);
    border-radius: var(--radius-md);
    padding: 3px;
    gap: 3px;

    .mode-option {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border: none;
      background: transparent;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);

      .mode-icon {
        font-size: 14px;
      }

      &:hover {
        color: var(--text-primary);
      }

      &.active {
        background: var(--card-bg);
        color: var(--theme-primary);
        box-shadow: var(--shadow-sm);

        .mode-icon {
          animation: bounce 0.3s ease-out;
        }
      }
    }
  }

  .toolbar-divider {
    width: 1px;
    height: 24px;
    background: linear-gradient(to bottom, transparent, var(--border-color), transparent);
    margin: 0 8px;
  }

  .model-select {
    flex: 1;
  }

  .config-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    background: var(--hover-bg);
    border-radius: var(--radius-sm);
    color: var(--theme-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(99, 102, 241, 0.15);
      transform: translateY(-1px);
    }
  }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ========== 对话区 ========== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-primary);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--theme-gradient);
    border-radius: 2px;

    &:hover {
      opacity: 0.8;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;

  .empty-avatar {
    display: inline-flex;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    background: var(--theme-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 8px 0;
  }

  .empty-hint {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
  }
}

/* ========== 打字指示器 ========== */
.typing-indicator {
  display: flex;
  gap: 6px;
  padding: 16px 20px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--theme-gradient);
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* ========== 输入区 ========== */
.chat-input-area {
  padding: 16px 20px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-color);

  .input-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 8px 8px 8px 16px;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;

    &:focus-within {
      border-color: var(--theme-primary);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
    }
  }

  .chat-textarea {
    flex: 1;
    border: none;
    padding: 8px 0;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    font-family: inherit;
    color: var(--text-primary);

    &::placeholder {
      color: var(--text-tertiary);
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  .send-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--text-tertiary);
    color: #fff;
    cursor: not-allowed;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &.enabled {
      background: var(--theme-gradient);
      cursor: pointer;

      &:hover {
        transform: scale(1.05);
        box-shadow: var(--shadow-lg);
      }

      &:active {
        transform: scale(0.98);
      }
    }

    svg {
      color: white;
    }

    .loading-spinner {
      animation: rotate 1s linear infinite;
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========== API 配置弹窗 ========== */
.api-config-modal {
  .modal-info {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    margin-bottom: 24px;
    border: 1px solid var(--border-color);

    .info-icon {
      font-size: 24px;
    }

    .info-content {
      h4 {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--text-primary);
      }

      p {
        margin: 0;
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
  }

  .model-selection {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .model-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      .model-card {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          border-color: var(--theme-primary);
          box-shadow: var(--shadow-md);
        }

        &.selected {
          border-color: var(--theme-primary);
          background: var(--bg-secondary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .card-icon {
          font-size: 24px;
        }

        .card-info {
          h5 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .card-badge {
            display: inline-block;
            padding: 2px 8px;
            background: var(--theme-gradient);
            color: white;
            font-size: 10px;
            font-weight: 600;
            border-radius: 10px;
            margin-left: 4px;
          }

          p {
            margin: 0;
            font-size: 12px;
            color: var(--text-secondary);
          }
        }
      }
    }
  }

  .api-input-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .api-help {
      margin-top: 12px;
      padding: 12px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-sm);

      p {
        margin: 0;
        font-size: 12px;
        color: var(--text-secondary);
        line-height: 1.6;

        a {
          color: var(--theme-primary);
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }

        .help-arrow {
          margin: 0 4px;
          color: var(--text-tertiary);
        }
      }
    }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }
}
</style>
