/**
 * 组件分类枚举
 */
export enum ComponentCategory {
  DATA_DISPLAY = 'data_display',
  FORM = 'form',
  UPLOAD_SELECT = 'upload_select',
  LAYOUT = 'layout',
}

/**
 * 组件演示配置接口
 */
export interface ComponentDemo {
  name: string
  description: string
  category: ComponentCategory
  component: () => Promise<any>
  previewData?: Record<string, any>
}

/**
 * 分类标签配置
 */
export const categories = [
  { key: ComponentCategory.DATA_DISPLAY, label: '数据展示', icon: 'BarChartOutlined' },
  { key: ComponentCategory.FORM, label: '表单组件', icon: 'FormOutlined' },
  { key: ComponentCategory.UPLOAD_SELECT, label: '上传选择', icon: 'UploadOutlined' },
  { key: ComponentCategory.LAYOUT, label: '布局组件', icon: 'LayoutOutlined' },
]

/**
 * 组件演示数据列表
 */
export const componentDemos: ComponentDemo[] = [
  // 数据展示类
  {
    name: 'StatCard',
    description: '统计卡片，用于展示关键指标数据，支持趋势显示',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/StatCard.vue'),
    previewData: {
      title: '总用户数',
      value: '12,345',
      trend: '+12%',
      icon: 'UserOutlined',
    },
  },
  {
    name: 'ProTable',
    description: '高级表格组件，集成分页、加载状态、数据请求等功能',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/ProTable.vue'),
    previewData: {
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '用户名', dataIndex: 'username', key: 'username' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
      ],
      dataSource: [
        { id: 1, username: '张三', email: 'zhangsan@example.com' },
        { id: 2, username: '李四', email: 'lisi@example.com' },
      ],
    },
  },
  {
    name: 'DescriptionList',
    description: '描述列表，用于展示键值对形式的数据',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/DescriptionList.vue'),
    previewData: {
      items: [
        { key: 'username', label: '用户名' },
        { key: 'email', label: '邮箱' },
        { key: 'role', label: '角色' },
      ],
      record: {
        username: '张三',
        email: 'zhangsan@example.com',
        role: '管理员',
      },
    },
  },

  // 表单组件
  {
    name: 'FormModal',
    description: '表单弹窗组件，支持新增和编辑模式',
    category: ComponentCategory.FORM,
    component: () => import('../components/FormModalDemo.vue'),
    previewData: {},
  },
  {
    name: 'SearchBar',
    description: '搜索栏组件，提供快速筛选功能',
    category: ComponentCategory.FORM,
    component: () => import('../components/SearchBarDemo.vue'),
    previewData: {},
  },
  {
    name: 'Toolbar',
    description: '工具栏组件，包含常用操作按钮',
    category: ComponentCategory.FORM,
    component: () => import('../components/ToolbarDemo.vue'),
    previewData: {},
  },

  // 上传选择类
  {
    name: 'UploadImage',
    description: '图片上传组件，支持拖拽上传和预览',
    category: ComponentCategory.UPLOAD_SELECT,
    component: () => import('@/components/common/UploadImage.vue'),
    previewData: undefined,
  },
  {
    name: 'IconSelect',
    description: '图标选择器，支持搜索和预览',
    category: ComponentCategory.UPLOAD_SELECT,
    component: () => import('@/components/common/IconSelect.vue'),
    previewData: undefined,
  },

  // 布局组件
  {
    name: 'ThemeSwitcher',
    description: '主题切换组件，支持亮色/暗色模式切换',
    category: ComponentCategory.LAYOUT,
    component: () => import('@/components/layout/ThemeSwitcher.vue'),
    previewData: undefined,
  },
]
