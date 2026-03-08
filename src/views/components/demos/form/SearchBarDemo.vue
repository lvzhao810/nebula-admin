<template>
  <div class="search-bar-demo">
    <!-- @core: 核心演示代码 -->
    <a-card title="SearchBar 搜索栏演示" class="shadow-card">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert
          message="搜索栏组件"
          description="SearchBar 是一个用于数据查询的表单组件，支持多种输入类型和响应式布局。"
          type="info"
          show-icon
        />

        <!-- 搜索栏示例 -->
        <SearchBar
          :model="searchModel"
          :items="searchItems"
          @search="handleSearch"
          @reset="handleReset"
        >
          <template #extra>
            <a-button @click="handleExport">
              <template #icon><DownloadOutlined /></template>
              导出
            </a-button>
          </template>
        </SearchBar>

        <!-- 搜索结果展示 -->
        <a-card title="搜索结果" size="small">
          <p><strong>当前搜索条件：</strong></p>
          <a-descriptions bordered size="small" :column="2">
            <a-descriptions-item label="关键词">
              {{ searchModel.keyword || '未设置' }}
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              {{ getStatusLabel(searchModel.status) }}
            </a-descriptions-item>
            <a-descriptions-item label="日期范围">
              {{ getDateRangeLabel(searchModel.dateRange) }}
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              {{ getRoleLabel(searchModel.role) }}
            </a-descriptions-item>
          </a-descriptions>

          <a-divider />

          <a-space :size="32">
            <a-statistic title="搜索次数" :value="searchCount" />
            <a-statistic title="最后搜索" :value="lastSearchTime || '-'" />
          </a-space>
        </a-card>
      </a-space>
    </a-card>
    <!-- @core-end -->

    <!-- 使用说明 -->
    <a-card title="使用说明" class="info-card" :bordered="false">
      <a-list :data-source="instructions" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <CheckCircleOutlined style="color: #52c41a; font-size: 16px" />
              </template>
              <template #description>{{ item }}</template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <!-- 代码展示 -->
    <CodeViewer
      :code="code"
      :core-code="coreCode"
      filename="SearchBarDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { DownloadOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
// SearchBar 通过 unplugin-vue-components 自动导入
import CodeViewer from '@/components/common/CodeViewer.vue'

// @core: 核心配置代码
const searchModel = reactive({
  keyword: '',
  status: undefined,
  dateRange: undefined,
  role: undefined,
})

const searchItems = [
  { name: 'keyword', label: '关键词', type: 'input', placeholder: '请输入关键词', span: 6 },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    span: 6,
    options: [
      { label: '全部', value: undefined },
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  { name: 'dateRange', label: '日期范围', type: 'daterange', span: 8 },
  {
    name: 'role',
    label: '角色',
    type: 'select',
    placeholder: '请选择角色',
    span: 4,
    options: [
      { label: '管理员', value: 'admin' },
      { label: '普通用户', value: 'user' },
      { label: '访客', value: 'guest' },
    ],
  },
]

const searchCount = ref(0)
const lastSearchTime = ref('')

function handleSearch() {
  searchCount.value++
  lastSearchTime.value = new Date().toLocaleTimeString()
  message.success('搜索已执行')
}

function handleReset() {
  message.info('搜索条件已重置')
}

function handleExport() {
  message.info('导出数据')
}

function getStatusLabel(status: number | undefined) {
  if (status === undefined) return '全部'
  return status === 1 ? '启用' : '禁用'
}

function getDateRangeLabel(dateRange: any) {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length === 0) {
    return '未设置'
  }
  return dateRange.map((d: any) => d.format('YYYY-MM-DD')).join(' ~ ')
}

function getRoleLabel(role: string | undefined) {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客',
  }
  return role ? roleMap[role] || role : '未设置'
}
// @core-end

const instructions = [
  '使用 model 绑定搜索表单数据',
  '通过 items 配置搜索项，支持 input、select、date、daterange 等类型',
  '使用 span 属性控制每个搜索项的宽度（基于 24 栅格）',
  '组件自动计算按钮位置，保持响应式布局',
  '支持 extra 插槽添加额外操作按钮',
]

// 代码字符串
const coreCodeParts = [
  '<template>\n  <SearchBar\n    :model="searchModel"\n',
  '    :items="searchItems"\n    @search="handleSearch"\n',
  '    @reset="handleReset"\n  >\n',
  '    <template #extra>\n',
  '      <a-button @click="handleExport">导出</a-button>\n',
  '    </template>\n  </SearchBar>\n</template>\n\n',
  '<script setup lang="ts">\n',
  'const searchModel = reactive({\n',
  '  keyword: \'\',\n  status: undefined,\n',
  '  dateRange: undefined,\n})\n\n',
  'const searchItems = [\n',
  '  { name: \'keyword\', label: \'关键词\', type: \'input\', span: 6 },\n',
  '  { name: \'status\', label: \'状态\', type: \'select\', span: 6,\n',
  '    options: [{ label: \'启用\', value: 1 }, ...] },\n',
  '  { name: \'dateRange\', label: \'日期范围\', type: \'daterange\', span: 8 },\n',
  ']\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'
</script>

<style scoped lang="less">
.search-bar-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}
</style>
