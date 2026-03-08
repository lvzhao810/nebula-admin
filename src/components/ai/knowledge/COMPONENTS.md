# 组件使用指南

本文档介绍 Nebula Admin 中常用组件的使用方法。

## 目录

- [ProTable](#protable)
- [FormModal](#formmodal)
- [AppHeader](#appheader)
- [AppMenu](#appmenu)
- [AI 助手](#ai-助手)

---

## ProTable

增强型数据表格组件，支持搜索、分页、排序等功能。

### 基础用法

```vue
<template>
  <ProTable
    :columns="columns"
    :request="fetchData"
    :row-selection="{
      selectedRowKeys: selectedKeys,
      onChange: onSelectChange
    }"
  >
    <template #toolbar>
      <a-button type="primary" @click="handleCreate">
        <PlusOutlined /> 新建
      </a-button>
      <a-button @click="handleExport">
        <DownloadOutlined /> 导出
      </a-button>
    </template>

    <template #action="{ record }">
      <a-space>
        <a-button type="link" size="small" @click="handleEdit(record)">
          编辑
        </a-button>
        <a-popconfirm
          title="确定要删除吗？"
          @confirm="handleDelete(record.id)"
        >
          <a-button type="link" size="small" danger>删除</a-button>
        </a-popconfirm>
      </a-space>
    </template>
  </ProTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '名称', dataIndex: 'name' },
  { title: '状态', dataIndex: 'status' },
  { title: '创建时间', dataIndex: 'createdAt' },
  { title: '操作', width: 150, slot: 'action' },
]

async function fetchData(params: any) {
  const { current, pageSize, ...searchParams } = params
  const response = await request.get('/api/users', {
    params: { page: current, size: pageSize, ...searchParams }
  })
  return {
    data: response.data.list,
    success: true,
    total: response.data.total
  }
}
</script>
```

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| columns | 列配置 | `Column[]` | `[]` |
| request | 数据请求函数 | `(params) => Promise` | - |
| rowSelection | 行选择配置 | `object` | - |
| pagination | 分页配置 | `object` | `{ showSizeChanger: true }` |
| search | 是否显示搜索表单 | `boolean` | `true` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| toolbar | 工具栏 |
| tableTitle | 表格标题 |

### 列配置项

```typescript
interface Column {
  title: string          // 列标题
  dataIndex: string      // 数据字段
  width?: number         // 列宽
  fixed?: 'left'|'right' // 固定列
  sorter?: boolean       // 是否可排序
  slot?: string          // 插槽名
  filters?: any[]        // 筛选菜单
  customRender?: any     // 自定义渲染
}
```

---

## FormModal

表单弹窗组件，用于创建和编辑操作。

### 基础用法

```vue
<template>
  <FormModal
    v-model:visible="visible"
    :title="isEdit ? '编辑用户' : '创建用户'"
    :schema="formSchema"
    :initial-values="initialValues"
    :on-submit="handleSubmit"
    :loading="submitting"
    width="600px"
  />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'

const visible = ref(false)
const submitting = ref(false)
const isEdit = ref(false)
const initialValues = reactive({})

const formSchema = [
  {
    field: 'username',
    label: '用户名',
    type: 'input',
    rules: [
      { required: true, message: '请输入用户名' },
      { min: 3, max: 20, message: '长度 3-20 个字符' }
    ]
  },
  {
    field: 'email',
    label: '邮箱',
    type: 'input',
    componentProps: {
      type: 'email'
    },
    rules: [
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '邮箱格式不正确' }
    ]
  },
  {
    field: 'role',
    label: '角色',
    type: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' }
    ],
    rules: [{ required: true, message: '请选择角色' }]
  },
  {
    field: 'status',
    label: '状态',
    type: 'switch',
    componentProps: {
      checkedChildren: '启用',
      unCheckedChildren: '禁用'
    },
    initialValue: true
  }
]

async function handleSubmit(values: any) {
  submitting.value = true
  try {
    if (isEdit.value) {
      await request.put(`/api/users/${values.id}`, values)
      message.success('更新成功')
    } else {
      await request.post('/api/users', values)
      message.success('创建成功')
    }
    visible.value = false
    // 刷新列表
  } finally {
    submitting.value = false
  }
}
</script>
```

### Schema 配置

```typescript
interface FormSchema {
  field: string           // 字段名
  label: string           // 标签
  type: 'input' |         // 输入框
        'textarea' |       // 文本域
        'select' |         // 选择器
        'radio' |          // 单选框
        'checkbox' |       // 复选框
        'switch' |         // 开关
        'date' |           // 日期选择
        'number'           // 数字输入
  componentProps?: any    // 组件属性
  options?: any[]         // 选项（select/radio/checkbox）
  rules?: any[]           // 验证规则
  initialValue?: any      // 初始值
  slot?: string           // 自定义插槽
}
```

---

## AppHeader

顶部导航栏组件。

### 功能

- 用户信息显示
- 下拉菜单操作
- 面包屑导航
- 通知中心

### 自定义

```vue
<template>
  <AppHeader>
    <template #extra>
      <a-space>
        <a-button type="primary" icon="plus">新建</a-button>
      </a-space>
    </template>
  </AppHeader>
</template>
```

---

## AppMenu

侧边菜单组件。

### 功能

- 多级菜单支持
- 菜单折叠
- 图标支持
- 选中状态高亮

### 菜单配置

```typescript
const menuItems = [
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: 'DashboardOutlined',
    meta: { permission: 'dashboard:view' }
  },
  {
    path: '/users',
    name: '用户管理',
    icon: 'UserOutlined',
    meta: { permission: 'user:view' },
    children: [
      {
        path: '/users/list',
        name: '用户列表',
        meta: { permission: 'user:list' }
      },
      {
        path: '/users/roles',
        name: '角色管理',
        meta: { permission: 'user:roles' }
      }
    ]
  }
]
```

---

## AI 助手

智能助手组件，提供系统使用咨询和日常闲聊功能。

### 使用方式

在主布局中引入：

```vue
<template>
  <BasicLayout>
    <!-- 其他内容 -->
    <AiAssistant />
  </BasicLayout>
</template>

<script setup lang="ts">
import AiAssistant from '@/components/ai/AiAssistant.vue'
</script>
```

### 工作模式

AI 助手有两种工作模式：

1. **工作模式**：专门回答 Nebula Admin 系统相关问题
2. **闲聊模式**：可以进行日常对话

### 支持的 AI 模型

- 通义千问（推荐，有免费额度）
- ChatGPT
- 文心一言
- 智谱 GLM

### 配置 API Key

首次使用时，需要配置 API Key：

```typescript
// 在代码中设置
import { useAiChat } from '@/composables/useAiChat'

const { saveApiKey } = useAiChat()
saveApiKey('your-api-key-here')
```

或在浏览器 localStorage 中设置：

```javascript
localStorage.setItem('ai-api-keys', JSON.stringify({
  qwen: 'your-qwen-api-key',
  chatgpt: 'your-openai-api-key'
}))
```

### 组件结构

```
AiAssistant (主组件)
├── AiChatWindow (聊天窗口)
│   ├── AiModeToggle (模式切换)
│   ├── AiModelSelect (模型选择)
│   └── AiChatMessage (消息气泡)
```

### API 集成

AI 助手通过 `useAiChat` composable 与后端交互：

```typescript
const { sendMessage, messages, isLoading } = useAiChat({
  mode: 'work',
  model: 'qwen'
})

await sendMessage('如何添加新用户？')
```

---

## 通用工具

### cn() - 类名合并

使用 `clsx` + `tailwind-merge` 合并类名：

```typescript
import { cn } from '@/utils/cn'

const className = cn(
  'base-class',
  isActive && 'active-class',
  props.customClass
)
```

### formatDateTime() - 日期格式化

```typescript
import { formatDateTime } from '@/utils/date'

const formatted = formatDateTime(new Date(), 'YYYY-MM-DD HH:mm:ss')
```

### downloadFile() - 文件下载

```typescript
import { downloadFile } from '@/utils/file'

downloadFile(blob, '用户列表.xlsx')
```

---

## 开发建议

1. **优先使用现有组件**：Ant Design Vue 提供了丰富的组件库
2. **组件复用**：将可复用的逻辑抽取为 composables
3. **类型安全**：为所有 Props 和 Emits 定义明确的类型
4. **性能优化**：使用 `v-memo`、`computed` 等优化渲染性能
5. **可访问性**：为交互元素添加 `aria-label`

---

## 更多示例

查看 `src/views/` 目录中的页面组件，了解完整的使用示例。
