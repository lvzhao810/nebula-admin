# Nebula Admin - AGENTS.md

本文件为在 nebula-admin 项目中工作的 AI Agent 提供指导原则。

---

## 1. 构建与测试命令

### 核心命令

```bash
# 开发服务器 (端口 3000, host: 0.0.0.0)
npm run dev

# 生产构建 (TypeScript 检查 + Vite 构建)
npm run build

# 预览生产构建
npm run preview

# ESLint 自动修复 (.vue, .js, .ts 文件)
npm run lint
```

### 测试命令

```bash
# 运行 Playwright E2E 测试
npm run test

# UI 模式运行测试
npm run test:ui

# 有头模式运行测试
npm run test:headed
```

### 运行单个测试文件

```bash
# 运行指定测试文件
npx playwright test tests/example.spec.ts

# 运行指定测试用例
npx playwright test tests/example.spec.ts -g "test name"

# 带参数运行
npx playwright test --reporter=line
```

---

## 2. 代码风格指南

### 2.1 语言与配置

- **TypeScript**: 严格模式已启用 (`strict: true`)
- **目标**: ES2020
- **模块**: ESNext
- **路径别名**: `@/*` -> `src/*`

### 2.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `user-info.ts`, `my-component.vue` |
| 组件/类型 | PascalCase | `UserInfo`, `MenuItem` |
| 函数/变量 | camelCase | `getUserList`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_ROLES`, `STATUS_MESSAGES` |
| CSS 类 | kebab-case | `.app-header`, `.nav-menu` |

### 2.3 Import 规范

```typescript
// 优先使用路径别名 @
import { request } from '@/utils/request'
import type { UserInfo, PageParams } from '@/types'
import { useUserStore } from '@/stores/user'

// Ant Design Vue 组件自动导入，无需手动 import
// Vue、Vue Router、Pinia API 自动导入

// 组件内导入顺序（保持一致性）:
import { ref, computed } from 'vue'           // Vue API
import { useRouter } from 'vue-router'        // 路由
import { useUserStore } from '@/stores/user'  // Store
import { getUserList } from '@/api/user'      // API
import type { UserInfo } from '@/types'       // 类型
import MyComponent from './MyComponent.vue'  // 组件
```

### 2.4 TypeScript 规范

- **必须**使用类型注解，避免 `any`
- **必须**为 API 响应定义接口类型
- **禁止**使用 `as any`、`@ts-ignore`、`@ts-expect-error` 压制类型错误

```typescript
// ✅ 正确
interface UserInfo {
  id: number | string
  username: string
  nickname?: string
}

// ❌ 错误
const user: any = response.data
```

### 2.5 组件规范

- 使用 `<script setup lang="ts">` 语法
- Props 使用 `withDefaults` 定义默认值
- 优先使用 Ant Design Vue 组件，而非构建自定义组件
- 为纯图标按钮添加 `aria-label`

```typescript
// Props 定义示例
interface Props {
  title: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
})
```

### 2.6 样式规范

- **必须**使用 Tailwind CSS 进行样式设计
- 使用 `cn` 工具函数 (`clsx` + `tailwind-merge`) 处理条件类名
- 项目使用 CSS 变量实现动态主题，支持亮色/暗色模式

```typescript
import { cn } from '@/utils/cn'

// 使用
<div :class="cn('base-class', isActive && 'active-class')">
```

### 2.7 错误处理规范

- 使用 Ant Design Vue 的 `message.error()` 显示错误提示
- API 请求错误使用 `Promise.reject()` 传递错误
- 避免空的 catch 块

```typescript
import { message } from 'ant-design-vue'

// 正确示例
try {
  await apiCall()
} catch (error) {
  message.error('操作失败，请重试')
  return Promise.reject(error)
}
```

### 2.8 API 请求规范

使用统一的 `request` 工具 (基于 Axios):

```typescript
import { request } from '@/utils/request'
import type { UserInfo, PageResult } from '@/types'

// GET 请求
export function getUserList(params: PageParams) {
  return request.get<PageResult<UserInfo>>('/user/list', { params })
}

// POST 请求
export function addUser(data: Partial<UserInfo>) {
  return request.post('/user', data)
}
```

### 2.9 权限控制规范

- 路由级权限: 在 `meta.permission` 中配置
- 按钮级权限: 使用 `v-permission` 指令
- 编程式检查: 使用 `hasPermission()` 工具函数

```vue
<!-- 按钮级权限 -->
<a-button v-permission="'system:user:add'">新增用户</a-button>
```

```typescript
// 编程式检查
import { hasPermission } from '@/utils/permission'

if (hasPermission('system:user:edit')) {
  // 执行操作
}
```

---

## 3. 项目架构速览

```
src/
├── api/           # API 接口层
├── components/    # 可复用组件 (common/, layout/, ai/)
├── composables/   # 组合式函数 (自动导入)
├── layouts/       # 页面布局
├── router/        # 路由配置
├── stores/        # Pinia 状态管理
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
└── views/         # 页面视图
```

### 核心依赖

- Vue 3 + Vite + TypeScript
- Ant Design Vue 4.x
- TailwindCSS 3.x
- Pinia (状态管理)
- Vue Router 4.x
- Axios (HTTP 客户端)
- ECharts (图表)
- Playwright (E2E 测试)

---

## 4. 开发环境

- **开发服务器**: `http://localhost:3000`
- **API 代理**: `/api` -> `http://localhost:8080`
- **默认账号**: admin / 123456

---

## 5. 注意事项

- 构建前执行 `vue-tsc` 类型检查
- 提交前运行 `npm run lint` 自动修复代码风格
- 测试文件位于 `tests/` 目录
- 使用 `npm run build` 验证构建通过后再提交
