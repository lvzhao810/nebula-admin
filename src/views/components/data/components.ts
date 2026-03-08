/**
 * 组件分类枚举
 */
export enum ComponentCategory {
  DATA_DISPLAY = 'data-display',
  FORM = 'form',
  UPLOAD_SELECT = 'upload-select',
  LAYOUT = 'layout',
  DRAG_DROP = 'drag-drop',
  EDITOR = 'editor',
  TABLE = 'table',
  INTERACTION = 'interaction',
}

/**
 * 组件演示配置接口
 */
export interface ComponentDemo {
  name: string
  title: string
  description: string
  category: ComponentCategory
  component: () => Promise<any>
  route: string
  tags?: string[]
}

/**
 * 组件演示数据列表
 */
export const componentDemos: ComponentDemo[] = [
  // ========== 数据展示 ==========
  {
    name: 'StatCard',
    title: '统计卡片',
    description: '用于展示关键指标数据，支持趋势显示',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/StatCard.vue'),
    route: 'stat-card',
    tags: ['数据', '卡片', '统计'],
  },
  {
    name: 'ProTable',
    title: '高级表格',
    description: '集成分页、加载状态、数据请求等功能',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/ProTable.vue'),
    route: 'pro-table',
    tags: ['表格', '分页', '数据'],
  },
  {
    name: 'DescriptionList',
    title: '描述列表',
    description: '用于展示键值对形式的数据',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/DescriptionList.vue'),
    route: 'description-list',
    tags: ['列表', '描述', '键值对'],
  },
  {
    name: 'CountTo',
    title: '数字动画',
    description: '数字增长动画效果，支持千分位和前缀后缀',
    category: ComponentCategory.DATA_DISPLAY,
    component: () => import('@/components/common/CountTo.vue'),
    route: 'count-to',
    tags: ['动画', '数字', '增长'],
  },

  // ========== 表单组件 ==========
  {
    name: 'FormModal',
    title: '表单弹窗',
    description: '支持新增和编辑模式的表单弹窗',
    category: ComponentCategory.FORM,
    component: () => import('@/components/common/FormModal.vue'),
    route: 'form-modal',
    tags: ['表单', '弹窗', '编辑'],
  },
  {
    name: 'SearchBar',
    title: '搜索栏',
    description: '提供快速筛选功能的搜索栏',
    category: ComponentCategory.FORM,
    component: () => import('@/components/common/SearchBar.vue'),
    route: 'search-bar',
    tags: ['搜索', '筛选', '表单'],
  },
  {
    name: 'Toolbar',
    title: '工具栏',
    description: '包含常用操作按钮的工具栏',
    category: ComponentCategory.FORM,
    component: () => import('@/components/common/Toolbar.vue'),
    route: 'toolbar',
    tags: ['工具栏', '按钮', '操作'],
  },

  // ========== 上传选择 ==========
  {
    name: 'UploadImage',
    title: '图片上传',
    description: '支持拖拽上传和预览的图片上传组件',
    category: ComponentCategory.UPLOAD_SELECT,
    component: () => import('@/components/common/UploadImage.vue'),
    route: 'upload-image',
    tags: ['上传', '图片', '拖拽'],
  },
  {
    name: 'IconSelect',
    title: '图标选择器',
    description: '支持搜索和预览的图标选择器',
    category: ComponentCategory.UPLOAD_SELECT,
    component: () => import('@/components/common/IconSelect.vue'),
    route: 'icon-select',
    tags: ['图标', '选择器', '搜索'],
  },
  {
    name: 'AvatarUpload',
    title: '头像上传',
    description: '支持裁剪的头像上传组件',
    category: ComponentCategory.UPLOAD_SELECT,
    component: () => import('@/components/common/AvatarUpload.vue'),
    route: 'avatar-upload',
    tags: ['头像', '上传', '裁剪'],
  },

  // ========== 布局组件 ==========
  {
    name: 'ThemeSwitcher',
    title: '主题切换',
    description: '支持亮色/暗色模式切换',
    category: ComponentCategory.LAYOUT,
    component: () => import('@/components/layout/ThemeSwitcher.vue'),
    route: 'theme-switcher',
    tags: ['主题', '切换', '暗色'],
  },
  {
    name: 'SplitPane',
    title: '分屏组件',
    description: '可拖拽调整大小的分屏组件',
    category: ComponentCategory.LAYOUT,
    component: () => import('@/components/common/SplitPane.vue'),
    route: 'split-pane',
    tags: ['分屏', '布局', '拖拽'],
  },
  {
    name: 'Sticky',
    title: '吸顶组件',
    description: '滚动时吸顶的容器组件',
    category: ComponentCategory.LAYOUT,
    component: () => import('@/components/common/Sticky.vue'),
    route: 'sticky',
    tags: ['吸顶', '滚动', '布局'],
  },
  {
    name: 'LazyContainer',
    title: '懒加载容器',
    description: '可视区域懒加载容器',
    category: ComponentCategory.LAYOUT,
    component: () => import('@/components/common/LazyContainer.vue'),
    route: 'lazy-container',
    tags: ['懒加载', '性能', '容器'],
  },

  // ========== 拖拽组件 ==========
  {
    name: 'DragDialog',
    title: '可拖拽对话框',
    description: '支持拖拽移动的对话框',
    category: ComponentCategory.DRAG_DROP,
    component: () => import('@/components/common/DragDialog.vue'),
    route: 'drag-dialog',
    tags: ['拖拽', '对话框', '弹窗'],
  },
  {
    name: 'DragList',
    title: '拖拽列表',
    description: '支持拖拽排序的列表',
    category: ComponentCategory.DRAG_DROP,
    component: () => import('@/components/common/DragList.vue'),
    route: 'drag-list',
    tags: ['拖拽', '列表', '排序'],
  },
  {
    name: 'DragKanban',
    title: '看板拖拽',
    description: '看板式的拖拽组件',
    category: ComponentCategory.DRAG_DROP,
    component: () => import('@/components/common/DragKanban.vue'),
    route: 'drag-kanban',
    tags: ['拖拽', '看板', '任务'],
  },
  {
    name: 'SortableTable',
    title: '可排序表格',
    description: '支持拖拽排序的表格',
    category: ComponentCategory.DRAG_DROP,
    component: () => import('@/components/common/SortableTable.vue'),
    route: 'sortable-table',
    tags: ['拖拽', '表格', '排序'],
  },

  // ========== 编辑器组件 ==========
  {
    name: 'RichTextEditor',
    title: '富文本编辑器',
    description: '所见即所得的富文本编辑器',
    category: ComponentCategory.EDITOR,
    component: () => import('@/components/common/RichTextEditor.vue'),
    route: 'rich-text-editor',
    tags: ['编辑器', '富文本', '文本'],
  },
  {
    name: 'MarkdownEditor',
    title: 'Markdown编辑器',
    description: 'Markdown 编辑和预览',
    category: ComponentCategory.EDITOR,
    component: () => import('@/components/common/MarkdownEditor.vue'),
    route: 'markdown-editor',
    tags: ['编辑器', 'Markdown', '预览'],
  },
  {
    name: 'JsonEditor',
    title: 'JSON编辑器',
    description: 'JSON 格式编辑和验证',
    category: ComponentCategory.EDITOR,
    component: () => import('@/components/common/JsonEditor.vue'),
    route: 'json-editor',
    tags: ['编辑器', 'JSON', '格式化'],
  },

  // ========== 表格增强 ==========
  {
    name: 'EditableTable',
    title: '可编辑表格',
    description: '支持行内编辑的表格',
    category: ComponentCategory.TABLE,
    component: () => import('@/components/common/EditableTable.vue'),
    route: 'editable-table',
    tags: ['表格', '编辑', '行内'],
  },
  {
    name: 'TreeTable',
    title: '树形表格',
    description: '支持树形结构的表格',
    category: ComponentCategory.TABLE,
    component: () => import('@/components/common/TreeTable.vue'),
    route: 'tree-table',
    tags: ['表格', '树形', '层级'],
  },

  // ========== 交互组件 ==========
  {
    name: 'BackToTop',
    title: '返回顶部',
    description: '滚动后显示的返回顶部按钮',
    category: ComponentCategory.INTERACTION,
    component: () => import('@/components/common/BackToTop.vue'),
    route: 'back-to-top',
    tags: ['返回', '顶部', '滚动'],
  },
  {
    name: 'ImagePreview',
    title: '图片预览',
    description: '支持放大缩小旋转的图片预览',
    category: ComponentCategory.INTERACTION,
    component: () => import('@/components/common/ImagePreview.vue'),
    route: 'image-preview',
    tags: ['图片', '预览', '放大'],
  },
  {
    name: 'QrCode',
    title: '二维码生成',
    description: '生成二维码组件',
    category: ComponentCategory.INTERACTION,
    component: () => import('@/components/common/QrCode.vue'),
    route: 'qr-code',
    tags: ['二维码', '生成', '扫码'],
  },
  {
    name: 'EllipsisText',
    title: '文本省略',
    description: '支持展开收起的文本省略',
    category: ComponentCategory.INTERACTION,
    component: () => import('@/components/common/EllipsisText.vue'),
    route: 'ellipsis-text',
    tags: ['文本', '省略', '展开'],
  },
]

/**
 * 按分类获取组件
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentDemo[] {
  return componentDemos.filter((c) => c.category === category)
}

/**
 * 根据路由获取组件
 */
export function getComponentByRoute(route: string): ComponentDemo | undefined {
  return componentDemos.find((c) => c.route === route)
}
