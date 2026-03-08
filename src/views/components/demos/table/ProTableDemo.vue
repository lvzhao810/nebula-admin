<template>
  <div class="pro-table-demo">
    <!-- @core: 核心演示代码 -->
    <ProTable
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      :row-selection="rowSelection"
      @refresh="loadData"
      @change="handleTableChange"
    >
      <!-- 工具栏左侧插槽 -->
      <template #toolbar-left>
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增用户
          </a-button>
          <a-button danger @click="handleBatchDelete">
            <template #icon><DeleteOutlined /></template>
            批量删除
          </a-button>
        </a-space>
      </template>

      <!-- 自定义单元格渲染 -->
      <template #bodyCell="{ column, record }">
        <!-- 状态列 -->
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </ProTable>
    <!-- @core-end -->

    <!-- 使用说明 -->
    <a-card title="使用说明" class="info-card" :bordered="false">
      <a-list :data-source="instructions" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <CheckCircleOutlined style="color: #52c41a; font-size: 16px;" />
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
      filename="ProTableDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import { PlusOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import CodeViewer from '@/components/common/CodeViewer.vue'
import { mockUsers, mockFetchUsers } from '@/views/components/mocks'

// @core: 核心配置代码
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '用户名', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
  { title: '角色', dataIndex: 'roleName', key: 'roleName', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150 },
]

const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true,
}

const dataSource = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const response = await mockFetchUsers({
      page: pagination.current,
      pageSize: pagination.pageSize,
    })
    dataSource.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    message.error('加载数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})

// 监听分页变化
function handleTableChange(pag: any) {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadData()
}
// @core-end

const instructions = [
  '配置 columns 数组定义表格列',
  '使用 dataSource 绑定表格数据',
  '使用 row-selection 配置行选择功能',
  '通过 bodyCell 插槽自定义单元格内容',
  '通过 toolbar-left 插槽自定义工具栏',
]

// 代码字符串
const coreCodeParts = [
  '<template>\n  <ProTable\n    :columns="columns"\n',
  '    :data-source="dataSource"\n    :pagination="pagination"\n',
  '    :loading="loading"\n    :row-selection="rowSelection"\n',
  '    @refresh="loadData"\n  >\n',
  '    <template #toolbar-left>\n      <a-button type="primary">新增用户</a-button>\n',
  '    </template>\n    <template #bodyCell="{ column, record }">\n',
  '      <template v-if="column.dataIndex === \'status\'">\n',
  '        <a-tag :color="record.status === 1 ? \'green\' : \'red\'">\n',
  '          {{ record.status === 1 ? \'启用\' : \'禁用\' }}\n        </a-tag>\n',
  '      </template>\n    </template>\n  </ProTable>\n',
  '</template>\n\n',
  '<script setup lang="ts">\nimport { ref, reactive, onMounted } from \'vue\'\n\n',
  'const columns = [\n  { title: \'用户名\', dataIndex: \'nickname\' },\n',
  '  { title: \'邮箱\', dataIndex: \'email\' },\n  { title: \'状态\', dataIndex: \'status\' },\n',
  '  { title: \'操作\', key: \'action\' },\n]\n\n',
  'const dataSource = ref([])\nconst loading = ref(false)\n',
  'const pagination = reactive({ current: 1, pageSize: 10, total: 0 })\n\n',
  'async function loadData() {\n  loading.value = true\n',
  '  // ...\n  loading.value = false\n',
  '}\n\n',
  'onMounted(() => {\n  loadData()\n',
  '})\n',
  '<' + '/script>\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'

// 操作处理函数
function handleAdd() {
  message.info('点击了新增按钮')
}

function handleEdit(record: any) {
  message.info(`编辑用户: ${record.nickname}`)
}

function handleDelete(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.nickname}" 吗？`,
    onOk: () => {
      message.success('删除成功')
    },
  })
}

function handleBatchDelete() {
  message.info('批量删除功能')
}
</script>

<style scoped lang="less">
.pro-table-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}
</style>
