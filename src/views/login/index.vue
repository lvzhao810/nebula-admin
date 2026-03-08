<template>
  <div class="login-container min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-nebula-900 via-nebula-800 to-aura-900"></div>
    <div class="absolute top-20 left-20 w-72 h-72 bg-nebula-500 rounded-full blur-3xl opacity-20 animate-float"></div>
    <div class="absolute bottom-20 right-20 w-96 h-96 bg-aura-500 rounded-full blur-3xl opacity-20 animate-float" style="animation-delay: 1s;"></div>
    <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-10 animate-float" style="animation-delay: 2s;"></div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover-card-lift">
        <!-- Logo 和标题 -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-nebula mb-4 shadow-neon">
            <span class="text-white text-2xl font-bold">N</span>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Nebula Admin</h1>
          <p class="text-white/60 text-sm">欢迎回来，开启工作之旅</p>
        </div>

        <!-- 登录表单 -->
        <a-form
          :model="loginForm"
          :rules="rules"
          @finish="handleLogin"
          layout="vertical"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="loginForm.username"
              size="large"
              placeholder="请输入用户名"
              class="!bg-white/5 !border-white/20 !text-white placeholder:text-white/40"
            >
              <template #prefix>
                <UserOutlined class="text-white/60" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="请输入密码"
              class="!bg-white/5 !border-white/20 !text-white placeholder:text-white/40"
            >
              <template #prefix>
                <LockOutlined class="text-white/60" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="flex items-center justify-between mb-6">
            <a-checkbox v-model:checked="loginForm.remember" class="!text-white/80 text-sm">
              记住我
            </a-checkbox>
            <a class="text-nebula-400 hover:text-nebula-300 text-sm">忘记密码？</a>
          </div>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="loading"
              class="!h-12 !bg-gradient-nebula !border-0 hover:!opacity-90 !font-medium text-base"
            >
              {{ loading ? '登录中...' : '登录' }}
            </a-button>
          </a-form-item>
        </a-form>

        <!-- 底部信息 -->
        <div class="text-center mt-6 pt-6 border-t border-white/10">
          <p class="text-white/40 text-xs">
            默认账号：admin / 密码：123456
          </p>
        </div>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="absolute bottom-6 left-0 right-0 text-center z-10">
      <p class="text-white/30 text-xs">© 2024 Nebula Admin. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
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

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(loginForm)
    message.success('登录成功')
    const redirect = (route.query.redirect as string) || '/dashboard'
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
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
}

:deep(.ant-input) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
  }

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
}

:deep(.ant-input-password) {
  .ant-input {
    background: transparent;
    border: none;
  }
}

:deep(.ant-checkbox-wrapper) {
  color: rgba(255, 255, 255, 0.8);

  .ant-checkbox {
    .ant-checkbox-inner {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);

      &:hover {
        border-color: rgba(99, 102, 241, 0.5);
      }
    }

    &.ant-checkbox-checked {
      .ant-checkbox-inner {
        background-color: #6366f1;
        border-color: #6366f1;
      }
    }
  }
}
</style>
