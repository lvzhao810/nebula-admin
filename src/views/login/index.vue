<template>
  <div class="login-container min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- 背景层 1: 深色底色 -->
    <div class="absolute inset-0 bg-[#050510]"></div>

    <!-- 背景层 2: 动态网格线 -->
    <div class="absolute inset-0 overflow-hidden">
      <svg class="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" stroke-width="0.5" class="text-indigo-400"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" class="grid-animate"/>
      </svg>
    </div>

    <!-- 背景层 3: 星尘粒子效果 -->
    <div class="absolute inset-0 overflow-hidden">
      <div v-for="(style, i) in particles" :key="i"
           class="absolute rounded-full bg-white/30 particle"
           :style="style">
      </div>
    </div>

    <!-- 背景层 4: 主光源渐变 -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
      <div class="absolute inset-0 bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-2xl"></div>
    </div>

    <!-- 背景层 5: 边缘光晕 -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-indigo-600/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-purple-600/15 to-transparent rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-[420px] mx-4">
      <div class="login-card">
        <!-- 顶部装饰线 -->
        <div class="card-accent-line"></div>

        <!-- Logo 和标题 -->
        <div class="text-center mb-8 pt-4">
          <div class="logo-wrapper mx-auto mb-5">
            <!-- 星云 Logo -->
            <svg class="logo-icon" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="logoGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#818cf8"/>
                  <stop offset="50%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#4f46e5"/>
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <!-- 外层光晕 -->
              <circle cx="40" cy="40" r="35" fill="none" stroke="url(#logoGrad)" stroke-width="0.5" opacity="0.3" class="pulse-slow"/>
              <circle cx="40" cy="40" r="28" fill="none" stroke="url(#logoGrad)" stroke-width="0.5" opacity="0.5" class="pulse-medium"/>
              <!-- N 字星云 -->
              <path d="M22 58 L22 22 L32 22 L40 45 L48 22 L58 22 L58 58 L50 58 L50 32 L40 55 L30 32 L30 58 Z"
                    fill="url(#logoGrad)" filter="url(#glow)" class="logo-letter"/>
              <!-- 装饰点 -->
              <circle cx="22" cy="18" r="1.5" fill="#818cf8" opacity="0.6" class="sparkle"/>
              <circle cx="58" cy="18" r="1" fill="#a78bfa" opacity="0.5" class="sparkle" style="animation-delay: 0.5s"/>
              <circle cx="40" cy="60" r="1.2" fill="#818cf8" opacity="0.4" class="sparkle" style="animation-delay: 1s"/>
            </svg>
            <!-- Logo 外围光晕 -->
            <div class="logo-glow"></div>
          </div>
          <h1 class="text-[28px] font-bold text-white tracking-tight mb-1">Nebula Admin</h1>
          <p class="text-white/50 text-sm">智能管理 · 高效协同</p>
        </div>

        <!-- 登录表单 -->
        <a-form
          :model="loginForm"
          :rules="rules"
          @finish="handleLogin"
          layout="vertical"
          class="login-form"
        >
          <a-form-item name="username" class="form-item">
            <a-input
              v-model:value="loginForm.username"
              size="large"
              placeholder="请输入用户名"
              class="custom-input"
            >
              <template #prefix>
                <UserOutlined class="input-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" class="form-item">
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="请输入密码"
              class="custom-input"
            >
              <template #prefix>
                <LockOutlined class="input-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="flex items-center justify-between mb-6 px-1">
            <a-checkbox v-model:checked="loginForm.remember" class="custom-checkbox">
              记住密码
            </a-checkbox>
            <a class="text-white/40 hover:text-indigo-400/80 text-sm transition-colors duration-300">忘记密码？</a>
          </div>

          <a-form-item class="mb-0">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="loading"
              class="login-btn"
            >
              <span class="btn-content">
                <span class="btn-text">{{ loading ? '登录中...' : '进入后台' }}</span>
                <ArrowRightOutlined v-if="!loading" class="btn-arrow" />
              </span>
              <span class="btn-shimmer"></span>
            </a-button>
          </a-form-item>
        </a-form>

        <!-- 底部信息 -->
        <div class="footer-info">
          <div class="footer-line"></div>
          <p class="text-white/30 text-xs">
            <span class="inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></span>
              系统运行正常
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="absolute bottom-6 left-0 right-0 text-center z-10">
      <p class="text-white/20 text-xs">Nebula Admin © {{ new Date().getFullYear() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import type { LoginParams } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const loginForm = reactive<LoginParams>({
  username: 'admin',
  password: '123456',
  remember: false,
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }] as any,
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }] as any,
}

// 预计算粒子样式，避免每次渲染重新计算
const particles = ref<Record<string, string>[]>([])

onMounted(() => {
  particles.value = Array.from({ length: 20 }, () => {
    const size = Math.random() * 2 + 1
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 4}s`,
    }
  })
})

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(loginForm)
    message.success('登录成功')
    const redirect = (route.query.redirect as string) || '/analytics'
    router.push(redirect)
  } catch (error: any) {
    message.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.login-container {
  background: #050510;
}

/* 网格动画 */
.grid-animate {
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

/* 粒子动画 */
.particle {
  animation: float 6s ease-in-out infinite;
  opacity: 0;
}

.particle:nth-child(odd) {
  animation-name: twinkle;
}

@keyframes float {
  0%, 100% {
    opacity: 0.2;
    transform: translateY(0);
  }
  50% {
    opacity: 0.5;
    transform: translateY(-20px);
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.6; }
}

/* 卡片样式 */
.login-card {
  position: relative;
  background: linear-gradient(135deg,
    rgba(15, 15, 35, 0.9) 0%,
    rgba(20, 18, 45, 0.85) 50%,
    rgba(15, 15, 35, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 36px 32px 28px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 0 80px -20px rgba(99, 102, 241, 0.3);
  animation: cardEnter 0.6s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 30px 60px -15px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.08) inset,
      0 0 100px -20px rgba(99, 102, 241, 0.4);
  }
}

@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 顶部装饰线 */
.card-accent-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(129, 140, 248, 0.8) 30%,
    rgba(167, 139, 250, 0.8) 70%,
    transparent 100%
  );
  border-radius: 0 0 2px 2px;
}

/* Logo 样式 */
.logo-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.logo-icon {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.logo-letter {
  animation: logoPulse 3s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.pulse-slow {
  animation: pulseRing 4s ease-in-out infinite;
}

.pulse-medium {
  animation: pulseRing 3s ease-in-out infinite reverse;
}

@keyframes pulseRing {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

.sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* 表单样式 */
.login-form {
  :deep(.ant-form-item) {
    margin-bottom: 20px;
  }
}

/* 输入框样式 */
.custom-input {
  background: rgba(15, 15, 30, 0.6) !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  border-radius: 12px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  height: 48px !important;
  font-size: 15px !important;
  transition: all 0.3s ease !important;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.4) !important;
    background: rgba(15, 15, 30, 0.8) !important;
  }

  &:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: rgba(99, 102, 241, 0.6) !important;
    background: rgba(15, 15, 30, 0.9) !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.1) !important;
  }
}

/* 覆盖浏览器自动填充样式 - 解决白底问题 */
:deep(.ant-input),
:deep(.ant-input-affix-wrapper .ant-input) {
  background: rgba(15, 15, 30, 0.6) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.9) !important;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3) !important;
    -webkit-text-fill-color: rgba(255, 255, 255, 0.3) !important;
  }

  /* 自动填充时保持暗色背景 */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 100px rgba(15, 15, 30, 0.9) inset !important;
    -webkit-text-fill-color: rgba(255, 255, 255, 0.9) !important;
    caret-color: rgba(255, 255, 255, 0.9) !important;
  }
}

/* 密码框样式 - 修复背景问题 */
:deep(.ant-input-password) {
  background: rgba(15, 15, 30, 0.6) !important;
  border: 1px solid rgba(99, 102, 241, 0.2) !important;
  border-radius: 12px !important;

  &:hover {
    border-color: rgba(99, 102, 241, 0.4) !important;
  }

  &:focus-within,
  &.ant-input-affix-wrapper-focused {
    border-color: rgba(99, 102, 241, 0.6) !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.1) !important;
  }

  .ant-input {
    background: transparent !important;
    color: rgba(255, 255, 255, 0.9) !important;
    -webkit-text-fill-color: rgba(255, 255, 255, 0.9) !important;
  }

  .ant-input-suffix {
    .anticon {
      color: rgba(255, 255, 255, 0.35) !important;
      transition: color 0.3s ease !important;

      &:hover {
        color: rgba(255, 255, 255, 0.6) !important;
      }
    }
  }
}

/* Checkbox 样式 */
:deep(.custom-checkbox) {
  .ant-checkbox {
    .ant-checkbox-inner {
      background: rgba(15, 15, 30, 0.6) !important;
      border: 1px solid rgba(99, 102, 241, 0.3) !important;
      border-radius: 6px !important;
      width: 18px !important;
      height: 18px !important;
      transition: all 0.3s ease !important;

      &::after {
        border-color: transparent !important;
      }
    }

    &.ant-checkbox-checked {
      .ant-checkbox-inner {
        background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
        border-color: transparent !important;

        &::after {
          border-color: white !important;
          border-radius: 6px !important;
        }
      }
    }

    &:hover .ant-checkbox-inner {
      border-color: rgba(99, 102, 241, 0.5) !important;
    }
  }

  .ant-checkbox + span {
    color: rgba(255, 255, 255, 0.5) !important;
    font-size: 14px !important;
    transition: color 0.3s ease !important;
  }

  &:hover .ant-checkbox + span {
    color: rgba(255, 255, 255, 0.7) !important;
  }
}

/* 登录按钮 */
.login-btn {
  position: relative !important;
  height: 50px !important;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: white !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3) !important;

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .btn-arrow {
    font-size: 14px;
    transition: transform 0.3s ease;
  }

  .btn-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4) !important;
    background: linear-gradient(135deg, #5b52e8 0%, #7274f3 50%, #8b4ef0 100%) !important;

    .btn-shimmer {
      animation: shimmerSlide 0.6s ease forwards;
    }

    .btn-arrow {
      transform: translateX(4px);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3) !important;
  }

  &:disabled {
    opacity: 0.7 !important;
  }
}

@keyframes shimmerSlide {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 底部信息 */
.footer-info {
  margin-top: 24px;
  text-align: center;
}

.footer-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.2) 50%,
    transparent 100%
  );
  margin-bottom: 16px;
}

/* 响应式 */
@media (max-width: 480px) {
  .login-card {
    padding: 28px 24px 22px;
    border-radius: 16px;
  }

  .logo-wrapper {
    width: 70px;
    height: 70px;
  }

  h1 {
    font-size: 24px !important;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
