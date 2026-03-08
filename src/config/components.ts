// src/config/components.ts
import { ComponentCategory, type ComponentInfo } from './components.types'

export const COMPONENT_REGISTRY: ComponentInfo[] = [
  // 表格组件
  {
    id: 'pro-table',
    name: 'ProTable 高级表格',
    category: ComponentCategory.TABLE,
    description: '支持分页、排序、筛选的高级表格组件，内置请求处理和加载状态',
    route: 'pro-table',
    demoPath: '@/views/components/demos/table/ProTableDemo.vue',
    tags: ['常用', '核心'],
    priority: 1,
  },
  {
    id: 'editable-table',
    name: 'EditableTable 可编辑表格',
    category: ComponentCategory.TABLE,
    description: '支持行内编辑的表格组件',
    route: 'editable-table',
    demoPath: '@/views/components/demos/table/EditableTableDemo.vue',
    tags: ['常用'],
    priority: 2,
  },
  {
    id: 'sortable-table',
    name: 'SortableTable 可排序表格',
    category: ComponentCategory.TABLE,
    description: '支持拖拽排序的表格组件',
    route: 'sortable-table',
    demoPath: '@/views/components/demos/table/SortableTableDemo.vue',
    priority: 3,
  },
  {
    id: 'tree-table',
    name: 'TreeTable 树形表格',
    category: ComponentCategory.TABLE,
    description: '支持树形结构的表格组件',
    route: 'tree-table',
    demoPath: '@/views/components/demos/table/TreeTableDemo.vue',
    priority: 4,
  },
  // 表单组件
  {
    id: 'form-modal',
    name: 'FormModal 表单弹窗',
    category: ComponentCategory.FORM,
    description: '通用的表单弹窗组件',
    route: 'form-modal',
    demoPath: '@/views/components/demos/form/FormModalDemo.vue',
    tags: ['常用', '核心'],
    priority: 1,
  },
  {
    id: 'search-bar',
    name: 'SearchBar 搜索栏',
    category: ComponentCategory.FORM,
    description: '灵活的搜索栏组件',
    route: 'search-bar',
    demoPath: '@/views/components/demos/form/SearchBarDemo.vue',
    tags: ['常用'],
    priority: 2,
  },
  {
    id: 'toolbar',
    name: 'Toolbar 工具栏',
    category: ComponentCategory.FORM,
    description: '表格工具栏组件',
    route: 'toolbar',
    demoPath: '@/views/components/demos/form/ToolbarDemo.vue',
    tags: ['常用'],
    priority: 3,
  },
  {
    id: 'upload-image',
    name: 'UploadImage 图片上传',
    category: ComponentCategory.UPLOAD_SELECT,
    description: '图片上传组件',
    route: 'upload-image',
    demoPath: '@/views/components/demos/upload-select/UploadImageDemo.vue',
    priority: 1,
  },
]

export const getComponentsByCategory = (category: ComponentCategory) => {
  return COMPONENT_REGISTRY.filter(c => c.category === category).sort((a, b) => a.priority - b.priority)
}

export const getComponentByRoute = (route: string) => {
  return COMPONENT_REGISTRY.find(c => c.route === route)
}
