<template>
  <div class="ai-assistant">
    <!-- 浮动按钮 -->
    <transition name="bounce">
      <div
        v-if="showButton"
        :class="['float-button', { 'breathing': isFirstVisit }]"
        @click="toggleChat"
        title="AI 助手"
      >
        <span class="ai-icon">🤖</span>
      </div>
    </transition>

    <!-- 首次访问引导气泡 -->
    <transition name="fade">
      <div v-if="showGuide && isFirstVisit" class="guide-bubble">
        <span>需要帮助？</span>
        <span class="guide-text">试试 AI 助手！</span>
        <CloseCircleOutlined class="guide-close" @click="dismissGuide" />
      </div>
    </transition>

    <!-- 聊天窗口 -->
    <AiChatWindow
      v-if="isChatOpen"
      :is-open="isChatOpen"
      @close="toggleChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import AiChatWindow from './AiChatWindow.vue'
import { useLocalStorage } from '@vueuse/core'

// 是否显示浮动按钮
const showButton = ref(true)

// 是否显示引导
const showGuide = ref(true)

// 是否首次访问
const isFirstVisit = ref(true)

// 是否打开聊天窗口
const isChatOpen = ref(false)

// 从本地存储读取首次访问状态
const visited = useLocalStorage('ai-assistant-visited', false)

// 从本地存储读取首次访问状态
onMounted(() => {
  isFirstVisit.value = !visited.value
  if (isFirstVisit.value) {
    visited.value = true
    // 3秒后自动隐藏引导
    setTimeout(() => {
      showGuide.value = false
    }, 3000)
  }
})

// 切换聊天窗口
function toggleChat() {
  isChatOpen.value = !isChatOpen.value
  // 打开聊天时隐藏引导
  if (isChatOpen.value) {
    showGuide.value = false
  }
}

// 关闭引导
function dismissGuide() {
  showGuide.value = false
}
</script>

<style scoped lang="less">
.ai-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.float-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--theme-gradient);
  box-shadow: var(--shadow-lg);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-xl);
  }

  &:active {
    transform: scale(0.95);
  }
}

.ai-icon {
  font-size: 24px;
  line-height: 1;
}

/* 呼吸灯效果 */
@keyframes breathing {
  0%, 100% {
    box-shadow: var(--shadow-lg);
  }
  50% {
    box-shadow: var(--shadow-xl);
  }
}

.breathing {
  animation: breathing 2s ease-in-out infinite;
}

/* 引导气泡 */
.guide-bubble {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .guide-text {
    font-size: 12px;
    color: var(--text-secondary);
  }

  .guide-close {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 12px;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 2px;

    &:hover {
      color: var(--text-secondary);
    }
  }
}

/* 浮动按钮动画 */
.bounce-enter-active {
  animation: bounce-in 0.4s ease-out;
}

.bounce-leave-active {
  animation: bounce-out 0.3s ease-in;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/* 引导气泡动画 */
.fade-enter-active {
  animation: fade-in 0.3s ease-out;
}

.fade-leave-active {
  animation: fade-out 0.2s ease-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>
