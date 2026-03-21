<template>
  <div class="component-detail-view">
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item>
        <router-link to="/components">组件库</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link :to="categoryLink">{{ categoryTitle }}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ component?.title }}</a-breadcrumb-item>
    </a-breadcrumb>

    <div class="page-header">
      <a-space direction="vertical" :size="8">
        <a-space>
          <h1 class="page-title">{{ component?.title }}</h1>
          <a-tag color="blue">{{ component?.name }}</a-tag>
        </a-space>
        <p class="page-description">{{ component?.description }}</p>
        <div v-if="component?.tags" class="tags">
          <a-tag v-for="tag in component.tags" :key="tag" color="green" size="small">
            {{ tag }}
          </a-tag>
        </div>
      </a-space>
    </div>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-card title="组件预览" class="preview-card">
          <div class="preview-area">
            <component :is="componentInstance" v-bind="previewData" />
          </div>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="代码示例" class="code-card">
          <template #extra>
            <a-button size="small" @click="copyCode">
              <template #icon><Icons.CopyOutlined /></template>
              复制
            </a-button>
          </template>
          <div class="code-area">
            <pre><code>{{ displayCode }}</code></pre>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="API 文档" class="api-card">
      <a-tabs>
        <a-tab-pane v-for="(columns, key) in tableColumns" :key="key" :tab="key.charAt(0).toUpperCase() + key.slice(1)">
          <a-table :columns="columns" :data-source="apiData[key as keyof typeof apiData]" :pagination="false" size="small" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as Icons from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { getComponentByRoute, type ComponentDemo } from './data/components'

const route = useRoute()
const router = useRouter()

const component = ref<ComponentDemo>()
const componentInstance = ref<any>(null)
const previewData = ref<Record<string, any>>({})
const displayCode = ref('')

const categoryTitles: Record<string, string> = {
  'data-display': '数据展示',
  form: '表单组件',
  'upload-select': '上传选择',
  layout: '布局组件',
  'drag-drop': '拖拽组件',
  editor: '编辑器组件',
  table: '表格增强',
  interaction: '交互组件',
}

const tableColumns = {
  props: [
    { title: '参数', dataIndex: 'name', key: 'name' },
    { title: '说明', dataIndex: 'description', key: 'description' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '默认值', dataIndex: 'default', key: 'default' },
  ],
  events: [
    { title: '事件名', dataIndex: 'name', key: 'name' },
    { title: '说明', dataIndex: 'description', key: 'description' },
    { title: '回调参数', dataIndex: 'callback', key: 'callback' },
  ],
  slots: [
    { title: '插槽名', dataIndex: 'name', key: 'name' },
    { title: '说明', dataIndex: 'description', key: 'description' },
  ],
}

const apiData = ref<{ props: any[]; events: any[]; slots: any[] }>({
  props: [],
  events: [],
  slots: [],
})

const categoryTitle = computed(() =>
  component.value ? categoryTitles[component.value.category] || component.value.category : ''
)

const categoryLink = computed(() =>
  component.value ? `/components/${component.value.category}` : '/components'
)

async function loadComponent() {
  const componentRoute = route.path.split('/')[3]
  const found = getComponentByRoute(componentRoute)

  if (!found) {
    router.push('/components/data-display')
    return
  }

  component.value = found

  try {
    const module = await found.component()
    componentInstance.value = markRaw(module.default || module)
  } catch (error) {
    console.error('Failed to load component:', error)
  }

  apiData.value = {
    props: (getMockProps as any)(found.name),
    events: (getMockEvents as any)(found.name),
    slots: (getMockSlots as any)(found.name),
  }
  previewData.value = getMockPreviewData(found.name)
  displayCode.value = generateCodeExample(found.name, previewData.value)
}

function getMockProps(name: string) {
  const propsMap: Record<string, any[]> = {
    CountTo: [
      { name: 'startVal', description: '起始值', type: 'number', default: '0' },
      { name: 'endVal', description: '结束值', type: 'number', default: '0' },
      { name: 'duration', description: '动画时长', type: 'number', default: '2000' },
    ],
  }
  return propsMap[name] || [{ name: '-', description: '暂无数据', type: '-', default: '-' }]
}

function getMockEvents() {
  return [{ name: '-', description: '暂无事件', callback: '-' }]
}

function getMockSlots() {
  return [{ name: '-', description: '暂无插槽' }]
}

function getMockPreviewData(name: string) {
  const dataMap: Record<string, any> = {
    // 数据展示
    CountTo: { endVal: 2024 },
    StatCard: { title: '总用户数', value: 12345, trend: 12, icon: 'UserOutlined', color: 'from-indigo-500 to-purple-500' },
    ProTable: {
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
    DescriptionList: {
      items: [
        { key: 'username', label: '用户名' },
        { key: 'email', label: '邮箱' },
        { key: 'status', label: '状态' },
      ],
      record: {
        username: 'admin',
        email: 'admin@example.com',
        status: '启用',
      },
    },

    // 表单组件
    FormModal: {
      visible: false,
      formData: { username: '', email: '' },
      formItems: [
        { name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
        { name: 'email', label: '邮箱', type: 'input', placeholder: '请输入邮箱' },
      ],
    },
    SearchBar: {
      model: { keyword: '', status: undefined },
      items: [
        { name: 'keyword', label: '关键词', type: 'input', placeholder: '请输入关键词' },
        { name: 'status', label: '状态', type: 'select', placeholder: '请选择状态', options: [] },
      ],
    },
    Toolbar: {
      buttons: [
        { key: 'add', label: '新增', type: 'primary', icon: 'PlusOutlined' },
        { key: 'delete', label: '删除', type: 'default', danger: true, icon: 'DeleteOutlined' },
      ],
      showRefresh: true,
    },

    // 上传选择
    UploadImage: { modelValue: '', limit: 1 },
    IconSelect: { modelValue: '' },
    AvatarUpload: { modelValue: '' },

    // 布局组件
    ThemeSwitcher: {},
    SplitPane: { minPercent: 20, defaultPercent: 50, split: 'vertical' },
    Sticky: { offsetTop: 0 },
    LazyContainer: {},

    // 拖拽组件
    DragDialog: { open: false, title: '可拖拽对话框' },
    DragList: {
      list: [
        { id: 1, text: '项目1' },
        { id: 2, text: '项目2' },
        { id: 3, text: '项目3' },
      ],
    },
    DragKanban: {
      data: [
        { id: 1, title: '待处理', items: [{ id: 1, title: '任务1' }] },
        { id: 2, title: '进行中', items: [] },
        { id: 3, title: '已完成', items: [] },
      ],
    },
    SortableTable: {
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '名称', dataIndex: 'name', key: 'name' },
      ],
      dataSource: [
        { id: 1, name: '项目1' },
        { id: 2, name: '项目2' },
      ],
    },

    // 编辑器组件
    RichTextEditor: { modelValue: '<p>欢迎使用富文本编辑器</p>' },
    MarkdownEditor: { modelValue: '# 欢迎使用 Markdown 编辑器\n\n这是一段示例文本。' },
    JsonEditor: { modelValue: '{\n  "name": "示例",\n  "value": 123\n}' },

    // 表格增强
    EditableTable: {
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '名称', dataIndex: 'name', key: 'name', editable: true },
      ],
      dataSource: [
        { id: 1, name: '项目1' },
        { id: 2, name: '项目2' },
        { id: 3, name: '项目3' },
      ],
    },
    TreeTable: {
      columns: [
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '值', dataIndex: 'value', key: 'value' },
      ],
      dataSource: [
        { id: 1, name: '根节点', value: '1', children: [
          { id: 2, name: '子节点1', value: '1-1' },
          { id: 3, name: '子节点2', value: '1-2' },
        ]},
      ],
    },

    // 交互组件
    BackToTop: { visibilityHeight: 200 },
    ImagePreview: { src: 'https://picsum.photos/300/200' },
    QrCode: { text: 'https://example.com', width: 150, height: 150 },
    EllipsisText: { text: '这是一段很长的文本，当超过指定长度时会被省略显示，点击展开按钮可以查看完整内容。', rows: 2 },
  }
  return dataMap[name] || {}
}

function generateCodeExample(name: string, data: Record<string, any>) {
  const props = Object.keys(data).map(key => {
    const val = data[key]
    if (typeof val === 'string') return ` ${key}="${val}"`
    if (typeof val === 'number') return ` :${key}="${val}"`
    return ` :${key}="{${JSON.stringify(val)}}"`
  }).join('')

  return `<template>
  <${name}${props} />
</template>

<script setup lang="ts">
import { ${name} } from '@/components'
<\/script>`
}

function copyCode() {
  navigator.clipboard.writeText(displayCode.value)
  message.success('代码已复制')
}

onMounted(() => {
  loadComponent()
})

watch(() => route.path, () => {
  loadComponent()
})
</script>

<style scoped lang="less">
.component-detail-view {
  padding: 24px;
}

.breadcrumb {
  margin-bottom: 16px;
}

.page-header {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-description {
  margin: 0;
  font-size: 16px;
  color: var(--text-secondary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-card,
.code-card,
.api-card {
  margin-bottom: 24px;
}

.preview-card :deep(.ant-card-head),
.code-card :deep(.ant-card-head),
.api-card :deep(.ant-card-head) {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.preview-card :deep(.ant-card-head-title),
.code-card :deep(.ant-card-head-title),
.api-card :deep(.ant-card-head-title) {
  color: var(--text-primary);
  font-weight: 600;
}

.preview-card :deep(.ant-card-body),
.code-card :deep(.ant-card-body),
.api-card :deep(.ant-card-body) {
  background: var(--card-bg);
}

.preview-area {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
}

.code-area {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 16px;
  overflow-x: auto;

  pre {
    margin: 0;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 13px;
    line-height: 1.5;

    code {
      color: var(--text-primary);
    }
  }
}

/* 表格样式优化 */
.api-card :deep(.ant-table) {
  background: var(--card-bg);
}

.api-card :deep(.ant-table-thead > tr > th) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

.api-card :deep(.ant-table-tbody > tr > td) {
  background: var(--card-bg);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color-light);
}

.api-card :deep(.ant-table-tbody > tr:hover > td) {
  background: var(--hover-bg) !important;
}

/* Tabs 样式优化 */
.api-card :deep(.ant-tabs-tab) {
  color: var(--text-secondary);
}

.api-card :deep(.ant-tabs-tab-active) {
  .ant-tabs-tab-btn {
    color: var(--theme-primary);
  }
}

.api-card :deep(.ant-tabs-ink-bar) {
  background: var(--theme-primary);
}
</style>
