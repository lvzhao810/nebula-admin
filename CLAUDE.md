# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 通信语言偏好

**必须使用中文与用户沟通**。所有回复、解释、问题都应该用中文。这是持久性偏好设置，无需每次会话重复说明。

## 项目概述

Nebula Admin 是一个采用充满活力的靛蓝-紫色渐变设计的 Vue 3 后台管理仪表板。使用 TypeScript、Vite、Ant Design Vue 和 TailwindCSS 构建。

## 开发命令

```bash
npm run dev         # 在端口 3000 启动开发服务器 (host: 0.0.0.0)
npm run build       # TypeScript 检查 (vue-tsc) + Vite 构建
npm run preview     # 预览生产构建
npm run lint        # ESLint 自动修复 (.vue, .js, .ts 文件)
npm run test        # 运行 Playwright 端到端测试
npm run test:ui     # UI 模式运行 Playwright 测试
npm run test:headed # 有头模式运行 Playwright 测试
```

### 测试说明

- 使用 Playwright 进行端到端测试
- 测试文件位于 `tests/` 目录
- 测试前会自动启动开发服务器 (`npm run dev`)
- 基础 URL: `http://localhost:3000`
- 支持 HTML 报告和 trace 重放

## 架构

### 分层结构

```
src/
├── api/           # API 服务层，包含类型化接口
│   ├── auth.ts    # 认证相关 API
│   ├── menu.ts    # 菜单相关 API
│   ├── role.ts    # 角色相关 API
│   └── user.ts    # 用户相关 API
├── components/    # 可复用组件
│   ├── common/    # 业务组件 (ProTable, FormModal, IconSelect 等)
│   └── layout/    # 布局组件 (AppHeader, AppMenu, TabsView, ThemeSwitcher)
├── composables/   # Vue 3 组合式函数 (自动导入)
├── config/        # 组件配置文件
├── constants/     # 常量定义
├── layouts/       # 页面布局模板 (BasicLayout, BlankLayout)
├── router/        # Vue Router 配置，支持动态路由
│   ├── routes.ts  # 路由定义
│   ├── index.ts   # 路由实例
│   └── guards.ts  # 路由守卫
├── stores/        # Pinia 状态管理
│   ├── user.ts        # 用户状态
│   ├── menu.ts        # 菜单状态
│   ├── permission.ts  # 权限状态
│   ├── tabs.ts        # 标签页状态
│   └── theme.ts       # 主题状态
├── types/         # TypeScript 类型定义
│   ├── index.ts   # 通用类型 (UserInfo, MenuItem, Role 等)
│   └── router.ts  # 路由相关类型
├── utils/         # 工具函数 (request, storage, permission)
└── views/         # 按功能模块组织的页面组件
```

### 自动导入配置

组件和组合式函数通过 `unplugin-auto-import` 和 `unplugin-vue-components` 自动导入：
- Vue、Vue Router 和 Pinia API 自动导入
- `src/composables/` 目录下的文件自动导入
- Ant Design Vue 组件自动注册

**除非必要，否则不要手动导入这些。**

### 权限系统 (RBAC)

应用使用基于动态路由的权限系统：

1. **路由级权限**：在路由 `meta.permission` 字段中设置
2. **按钮级权限**：使用 `v-permission` 指令
3. **编程式检查**：使用 `@/utils/permission` 的 `hasPermission()` 工具

路由根据用户权限动态生成。路由守卫 (`src/router/guards.ts`) 在首次登录后导航时获取用户信息并生成可访问路由。

### HTTP 客户端 (`src/utils/request.ts`)

基于 Axios 的拦截器：
- 自动从 localStorage 包含 Bearer token
- 处理 401/403，自动登出并重定向
- 通过 `message.error()` 标准化错误响应
- 导出类型化的 `request` 对象，包含 get/post/put/delete/patch 方法

API 响应格式：`{ code: number, data: T, message: string }`

### 动态路由

路由使用 hash 模式 (`createWebHashHistory`)。动态路由通过权限获取后的 `router.addRoute()` 添加。NOT_FOUND_ROUTE 始终注册为后备路由。

**路由守卫白名单**：`['/login', '/404', '/403']`

**路由流程**：
1. 无 token 且不在白名单 → 重定向到登录页
2. 有 token 但未获取用户信息 → 获取用户信息并生成动态路由
3. 有 token 且已获取用户信息 → 正常导航
4. 已登录用户访问登录页 → 重定向到仪表板

### 主题系统

项目使用 CSS 变量实现动态主题切换，支持亮色/暗色模式：

**CSS 变量**（在 `tailwind.config.js` 中引用）：
- `--theme-primary`: 主色调
- `--theme-secondary`: 次色调
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`: 背景色
- `--text-primary`, `--text-secondary`, `--text-tertiary`: 文本色
- `--border-color`: 边框颜色
- `--card-bg`, `--hover-bg`: 卡片和悬停背景色
- `--radius-sm`, `--radius-md`, `--radius-lg`: 圆角
- `--shadow-xs` 到 `--shadow-xl`: 阴影
- `--space-xs` 到 `--space-xl`: 间距

**主题管理**：通过 `src/stores/theme.ts` 和 `ThemeSwitcher.vue` 组件管理

### 开发环境配置

- 开发服务器运行在端口 3000，host: `0.0.0.0`
- API 请求代理到 `localhost:8080`（在 `vite.config.ts` 中配置）
- 环境变量配置在 `.env.development` 和 `.env.production` 中
- API 基础路径：`/api`（由后端代理处理）

### TypeScript 配置

- 目标: ES2020
- 严格模式已启用
- 路径别名: `@/*` → `src/*`
- 构建前执行 `vue-tsc` 进行类型检查

### 可复用组件 (src/components/common/)

常用业务组件：
- **ProTable**: 高级表格组件，支持分页、搜索、工具栏
- **FormModal**: 表单弹窗组件
- **IconSelect**: 图标选择器
- **SearchBar**: 搜索栏组件
- **EditableTable**: 可编辑表格
- **SortableTable**: 可排序表格
- **StatCard**: 统计卡片
- **UploadImage**: 图片上传
- **AvatarUpload**: 头像上传
- **CodeViewer**: 代码查看器
- **MarkdownEditor**: Markdown 编辑器
- **RichTextEditor**: 富文本编辑器
- **JsonEditor**: JSON 编辑器
- **QrCode**: 二维码生成器
- **ImagePreview**: 图片预览
- **DragKanban**: 拖拽看板
- **DragList**: 拖拽列表
- **CountTo**: 数字动画
- **BackToTop**: 返回顶部
- **Sticky**: 吸顶组件

## 默认凭据

- 用户名：`admin`
- 密码：`123456`

## 设计系统

`tailwind.config.js` 中的自定义 TailwindCSS 主题：
- **主色**：靛蓝 (#6366f1) - `nebula` 调色板
- **次色**：紫色 (#8b5cf6) - `aura` 调色板
- **自定义动画**：float、slide-in、fade-in、scale-in、shimmer、gradient-x
- **自定义阴影**：neon、neon-purple（霓虹发光效果）
- **暗色模式**：通过 `darkMode: 'class'` 支持

### 使用 Tailwind 的 CSS 变量

项目通过 CSS 变量实现动态主题，Tailwind 配置中引用这些变量：
- 颜色: `primary`, `secondary`, `bg-*`, `text-*`, `border-default`, `card-bg`, `hover-bg`
- 圆角: `rounded-sm`, `rounded-md`, `rounded-lg`
- 阴影: `shadow-xs` 到 `shadow-xl`
- 间距: `space-xs` 到 `space-xl`

## 命名规范

- 组件和类型使用 PascalCase
- 函数和变量使用 camelCase
- 文件名使用 kebab-case

## UI 开发指南

在进行 UI 组件和功能开发时，请遵循以下最佳实践：

### 技术栈与工具

- **必须**使用 Tailwind CSS 进行样式设计
- **必须**使用 `cn` 工具函数 (`clsx` + `tailwind-merge`) 处理条件类名逻辑
- **应该**优先使用 Ant Design Vue 组件，而非构建自定义组件
- **必须**在使用前优先使用现有的动画工具
- **可以**使用项目现有的 25+ 业务组件（见"可复用组件"章节）

### 组件开发规范

- **必须**为纯图标按钮添加 `aria-label`
- **必须**对任何有键盘/焦点行为的组件使用可访问的组件原语
- **应该**优先使用项目现有的组件原语
- **必须**尊重现有设计系统（靛蓝-紫色主题、玻璃拟态效果）
- **禁止**在同一交互表面混合使用不同的组件系统

### 交互与用户体验

- **必须**对破坏性或不可逆操作使用 `AlertDialog` (Ant Design Vue `Modal.confirm`)
- **应该**为加载状态使用结构化骨架屏
- **必须**在操作发生的位置显示错误（内联验证）
- **必须**为固定的移动端元素尊重 `safe-area-inset`
- **禁止**阻止 `input` 或 `textarea` 元素中的粘贴操作

### 动画最佳实践

- **禁止**添加动画，除非它有明确的目的
- **必须**只动画合成器属性 (`transform`、`opacity`、`filter`)
- **禁止**动画布局属性 (`width`、`height`、`top`、`left`、`margin`、`padding`)
- **应该**对进入动画使用 `ease-out`
- **禁止**交互反馈动画超过 `200ms`
- **应该**尊重 `prefers-reduced-motion` 媒体查询

### 排版规范

- **必须**对标题使用 `text-balance`，对正文/段落使用 `text-pretty`
- **必须**对数值数据使用 `tabular-nums`
- **应该**对密集 UI 使用 `truncate` 或 `line-clamp`
- **禁止**修改 `letter-spacing` (`tracking-*`)，除非明确要求

### 布局与间距

- **必须**使用设计系统中的现有 `z-index` 层级
- **应该**一致使用 Tailwind 的间距规范
- **应该**对方形元素使用 `size-*` 而非分离的 `w-*` + `h-*`

### 性能优化

- **禁止**在活动动画外使用 `will-change`
- **应该**避免动画化大型 `blur()` 或 `backdrop-filter` 表面
- **应该**使用 Vue 的 `v-once` 指令优化静态内容
- **应该**合理使用 `v-memo` 指令优化列表渲染

### 代码质量

- **必须**确保 TypeScript 严格模式检查通过
- **应该**在提交前运行 `npm run lint` 自动修复代码风格问题
- **应该**为复杂的业务逻辑添加适当的注释（中文）

## 重要类型定义 (src/types/)

### 核心类型

**UserInfo**: 用户信息
- `id`, `username`, `nickname`, `avatar`, `email`, `phone`
- `status`, `roleId`, `roleName`, `createTime`

**MenuItem**: 菜单项
- `id`, `parentId`, `title`, `path`, `icon`, `component`
- `type`: 1=目录, 2=菜单, 3=按钮
- `sort`, `status`, `permission`, `children`

**Role**: 角色
- `id`, `roleName`, `roleCode`, `description`, `status`
- `permissions`, `createTime`

**Permission**: 权限
- `id`, `name`, `code`, `type`: 1=菜单, 2=按钮
- `parentId`

**RouteMeta**: 路由元信息
- `title`, `permission`, `icon`, `hideInMenu`, `requiresAuth`, `keepAlive`

### 通用类型

**PageParams**: 分页参数 - `{ page, pageSize }`
**PageResult\<T\>**: 分页响应 - `{ list, total, page, pageSize }`
**ApiResponse\<T\>**: API 响应 - `{ code, data, message }`

## 核心依赖库

### UI 框架
- **Vue 3.4**: 渐进式 JavaScript 框架
- **Ant Design Vue 4.1**: UI 组件库
- **TailwindCSS 3.4**: 原子化 CSS 框架
- **@ant-design/icons-vue 7.0**: 图标库

### 状态与路由
- **Pinia 2.1**: Vue 状态管理
- **Vue Router 4.3**: 官方路由管理器

### 工具库
- **axios 1.6**: HTTP 客户端
- **VueUse 14.1**: Vue 组合式工具集
- **lodash-es 4.17**: JavaScript 工具库
- **dayjs 1.11**: 日期处理库

### 特殊功能
- **echarts 5.5**: 数据可视化图表
- **vuedraggable 4.1**: 拖拽功能
- **qrcode 1.5**: 二维码生成
- **marked 17.0**: Markdown 解析器

### 开发工具
- **Vite 5.1**: 构建工具
- **TypeScript 5.4**: 类型系统
- **Playwright 1.58**: 端到端测试
- **ESLint**: 代码检查
- **unplugin-auto-import**: 自动导入 API
- **unplugin-vue-components**: 自动导入组件

## 代码质量检查清单

在提交代码前，请确保：

- [ ] TypeScript 类型检查通过 (`npm run build`)
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 新增组件符合项目设计系统
- [ ] 纯图标按钮添加了 `aria-label`
- [ ] 破坏性操作使用了确认对话框
- [ ] 表单有适当的验证
- [ ] 复杂逻辑添加了中文注释
- [ ] 颜色对比度符合 WCAG AA 标准
- [ ] 键盘导航适用于所有交互元素
