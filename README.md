# Nebula Admin

一个年轻活力风格的后台管理平台，基于 Vue 3 + Vite + Ant Design Vue + TailwindCSS 构建。

## 特性

- 🎨 **年轻活力设计** - 靛蓝 + 紫色渐变配色，拒绝千篇一律
- 🚀 **Vue 3 + Vite** - 最新技术栈，极速开发体验
- 🛡️ **权限管理** - 完整的 RBAC 权限控制系统
- 📦 **组件库** - 丰富的常用组件封装
- 📊 **数据可视化** - ECharts 图表集成
- 🎯 **TypeScript** - 完整的类型支持
- 📱 **响应式设计** - 适配各种设备

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **UI 组件**: Ant Design Vue
- **样式**: TailwindCSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **图表**: ECharts
- **请求**: Axios
- **语言**: TypeScript

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
nebula-admin/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 资源文件
│   │   ├── images/
│   │   └── styles/
│   ├── components/        # 公共组件
│   │   ├── common/        # 通用组件
│   │   └── layout/        # 布局组件
│   ├── composables/       # 组合式函数
│   ├── layouts/           # 页面布局
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   │   ├── dashboard/     # 数据概览
│   │   ├── system/        # 系统管理
│   │   │   ├── user/      # 用户管理
│   │   │   ├── role/      # 角色管理
│   │   │   └── menu/      # 菜单管理
│   │   ├── login/         # 登录页
│   │   └── error/         # 错误页
│   ├── App.vue
│   └── main.ts
├── .env.development       # 开发环境配置
├── .env.production        # 生产环境配置
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 默认账号

- 用户名: `admin`
- 密码: `123456`

## 组件列表

### 通用组件

- `ProTable` - 高级表格组件
- `FormModal` - 表单弹窗组件
- `UploadImage` - 图片上传组件
- `IconSelect` - 图标选择器
- `SearchBar` - 搜索栏组件
- `Toolbar` - 工具栏组件
- `DescriptionList` - 描述列表组件
- `StatCard` - 统计卡片组件

### 布局组件

- `BasicLayout` - 主布局（侧边栏 + 头部 + 内容区）
- `BlankLayout` - 空白布局（用于登录页等独立页面）

## 权限系统

### 路由级权限

在路由 meta 中配置 `permission` 字段：

```typescript
{
  path: '/system/user',
  meta: {
    permission: 'system:user:view'
  }
}
```

### 按钮级权限

使用 `v-permission` 指令：

```vue
<a-button v-permission="'system:user:add'">新增用户</a-button>
```

### 编程式权限

```typescript
import { hasPermission } from '@/utils/permission'

if (hasPermission('system:user:edit')) {
  // 有权限
}
```

## 配色方案

- **主色调**: 靛蓝 (#6366f1)
- **次色调**: 紫色 (#8b5cf6)
- **背景色**: 浅灰 (#f5f7fa)
- **卡片阴影**: 柔和立体感

## License

MIT
