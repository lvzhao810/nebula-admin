# Nebula Admin 系统文档

本文档提供 Nebula Admin 后台管理系统的使用说明和最佳实践。

## 目录

- [快速开始](#快速开始)
- [系统架构](#系统架构)
- [核心功能](#核心功能)
- [组件使用](#组件使用)
- [常见问题](#常见问题)

---

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 默认登录凭据

- **用户名**: `admin`
- **密码**: `123456`

### 构建生产版本

```bash
npm run build
```

---

## 系统架构

### 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件**: Ant Design Vue
- **样式方案**: TailwindCSS + LESS
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **类型系统**: TypeScript

### 项目结构

```
nebula-admin/
├── src/
│   ├── api/           # API 服务层
│   ├── components/    # 可复用组件
│   │   ├── common/    # 业务组件
│   │   ├── layout/    # 布局组件
│   │   └── ai/        # AI 助手模块
│   ├── composables/   # 组合式函数
│   ├── layouts/       # 页面布局
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia 状态管理
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   └── views/         # 页面组件
├── public/            # 静态资源
└── docs/              # 项目文档
```

### 分层架构

1. **API 层** (`src/api/`): 封装所有 HTTP 请求
2. **组件层** (`src/components/`): 可复用的 UI 组件
3. **视图层** (`src/views/`): 页面级组件
4. **状态层** (`src/stores/`): 全局状态管理
5. **工具层** (`src/utils/`): 通用工具函数

---

## 核心功能

### 权限系统 (RBAC)

系统使用基于动态路由的权限控制：

**路由级权限**：在路由配置中设置 `meta.permission`
```typescript
{
  path: '/users',
  meta: { permission: 'user:view' }
}
```

**按钮级权限**：使用 `v-permission` 指令
```vue
<a-button v-permission="'user:create'">创建用户</a-button>
```

**编程式检查**：
```typescript
import { hasPermission } from '@/utils/permission'

if (hasPermission('user:edit')) {
  // 执行操作
}
```

### 数据表格 (ProTable)

ProTable 是增强型表格组件，支持：

- 搜索表单
- 列配置
- 分页
- 排序
- 工具栏操作

```vue
<ProTable
  :columns="columns"
  :request="fetchUsers"
  :row-selection="true"
>
  <template #toolbar>
    <a-button type="primary">创建</a-button>
  </template>
</ProTable>
```

### 表单模态框 (FormModal)

用于表单弹窗的封装组件：

```vue
<FormModal
  v-model:visible="visible"
  :title="'创建用户'"
  :schema="formSchema"
  :on-submit="handleSubmit"
/>
```

---

## 组件使用

### 自动导入

项目使用 `unplugin-auto-import` 和 `unplugin-vue-components` 自动导入：

- Vue API (`ref`, `computed`, `watch` 等)
- Vue Router API
- Pinia API
- Ant Design Vue 组件
- `src/composables/` 目录下的组合式函数

**不需要手动导入以上内容**

### 主题定制

项目使用靛蓝-紫色渐变主题：

```css
/* CSS 变量 */
--theme-primary: #6366f1;    /* 靛蓝 */
--theme-secondary: #8b5cf6;  /* 紫色 */
--theme-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
```

### 玻璃拟态效果

```less
.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 常见问题

### Q: 如何添加新页面？

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/routes/` 添加路由配置
3. 如果需要权限控制，添加 `meta.permission`

### Q: 如何调用 API？

在 `src/api/` 创建 API 模块：

```typescript
// src/api/users.ts
import { request } from '@/utils/request'

export function fetchUsers(params: any) {
  return request.get('/users', { params })
}

export function createUser(data: any) {
  return request.post('/users', data)
}
```

### Q: 如何处理表单验证？

使用 Ant Design Vue 的表单验证：

```vue
<a-form ref="formRef" :model="formState" :rules="rules">
  <a-form-item label="用户名" name="username">
    <a-input v-model:value="formState.username" />
  </a-form-item>
</a-form>

<script setup lang="ts">
const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '长度 3-20 个字符' }
  ]
}
</script>
```

### Q: 如何使用状态管理？

创建 Pinia Store：

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),

  actions: {
    setUserInfo(info: any) {
      this.userInfo = info
    }
  }
})
```

### Q: 如何自定义主题？

编辑 `tailwind.config.js`：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
      }
    }
  }
}
```

### Q: 如何处理权限？

1. 后端返回用户权限列表
2. 前端根据权限动态生成路由
3. 使用 `v-permission` 指令控制按钮显示
4. 使用 `hasPermission()` 函数编程式检查

### Q: 如何添加新的 AI 模型？

在 `src/components/ai/config/models.ts` 添加配置：

```typescript
export const AI_MODELS: Record<string, AiModelConfig> = {
  // ...existing models
  newmodel: {
    id: 'newmodel',
    name: '新模型',
    provider: '提供商',
    apiUrl: 'API 地址',
    modelName: '模型名称',
    freeQuota: 1000000,
  },
}
```

---

## 开发规范

### 命名规范

- **组件**: PascalCase (如 `UserList.vue`)
- **文件名**: kebab-case (如 `user-service.ts`)
- **变量/函数**: camelCase (如 `fetchUsers`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

### TypeScript 规范

- 优先使用接口定义数据结构
- 为组件 Props 定义明确的类型
- 避免使用 `any`，使用 `unknown` 代替

### Vue 组件规范

- 使用 `<script setup>` 语法
- Props 使用 TypeScript 类型定义
- Emits 使用类型声明
- 优先使用 Composition API

---

## 故障排查

### 开发服务器启动失败

检查端口 3000 是否被占用：

```bash
# 查找占用进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### API 请求失败

1. 检查 `vite.config.ts` 中的代理配置
2. 确认后端服务是否运行在 `localhost:8080`
3. 检查 Network 标签查看请求详情

### 路由不生效

1. 检查路由配置是否正确
2. 确认用户是否有该路由权限
3. 查看路由守卫日志

---

## 更多帮助

如有其他问题，请联系技术支持或查阅详细文档。
