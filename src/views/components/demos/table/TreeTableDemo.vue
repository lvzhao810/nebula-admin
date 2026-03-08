<template>
  <div class="tree-table-demo">
    <!-- @core: 核心演示代码 -->
    <TreeTable
      :columns="columns"
      :data-source="dataSource"
    >
      <template #status="{ record }">
        <a-badge
          :status="record.status === 'online' ? 'success' : record.status === 'warning' ? 'warning' : 'error'"
          :text="record.status === 'online' ? '运行中' : record.status === 'warning' ? '警告' : '离线'"
        />
      </template>
      <template #cpu="{ record }">
        <a-progress
          :percent="record.cpu"
          :status="record.cpu > 80 ? 'exception' : record.cpu > 50 ? 'active' : 'success'"
          size="small"
        />
      </template>
      <template #memory="{ record }">
        <a-progress
          :percent="record.memory"
          :status="record.memory > 80 ? 'exception' : record.memory > 50 ? 'active' : 'success'"
          size="small"
        />
      </template>
    </TreeTable>
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
      filename="TreeTableDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'

// @core: 核心配置代码
interface ServerNode {
  id: string | number
  name: string
  ip: string
  status: string
  cpu: number
  memory: number
  children?: ServerNode[]
}

const columns = [
  { title: '服务器名称', dataIndex: 'name', key: 'name' },
  { title: 'IP 地址', dataIndex: 'ip', key: 'ip' },
  { title: '状态', dataIndex: 'status', key: 'status', slot: 'status' },
  { title: 'CPU 使用率', dataIndex: 'cpu', key: 'cpu', slot: 'cpu' },
  { title: '内存使用率', dataIndex: 'memory', key: 'memory', slot: 'memory' },
]

const dataSource = ref<ServerNode[]>([
  {
    id: '1',
    name: '华东数据中心',
    ip: '192.168.1.0',
    status: 'online',
    cpu: 45,
    memory: 62,
    children: [
      {
        id: '1-1',
        name: 'Web 服务器组 A',
        ip: '192.168.1.1',
        status: 'online',
        cpu: 42,
        memory: 58,
        children: [
          { id: '1-1-1', name: 'Web-01', ip: '192.168.1.101', status: 'online', cpu: 35, memory: 45 },
          { id: '1-1-2', name: 'Web-02', ip: '192.168.1.102', status: 'online', cpu: 48, memory: 52 },
          { id: '1-1-3', name: 'Web-03', ip: '192.168.1.103', status: 'warning', cpu: 75, memory: 68 },
        ],
      },
      {
        id: '1-2',
        name: '应用服务器组 B',
        ip: '192.168.1.2',
        status: 'online',
        cpu: 55,
        memory: 70,
        children: [
          { id: '1-2-1', name: 'App-01', ip: '192.168.1.201', status: 'online', cpu: 42, memory: 55 },
          { id: '1-2-2', name: 'App-02', ip: '192.168.1.202', status: 'offline', cpu: 0, memory: 0 },
        ],
      },
      {
        id: '1-3',
        name: '数据库服务器组 C',
        ip: '192.168.1.3',
        status: 'warning',
        cpu: 72,
        memory: 85,
        children: [
          { id: '1-3-1', name: 'DB-Master', ip: '192.168.1.301', status: 'warning', cpu: 78, memory: 88 },
          { id: '1-3-2', name: 'DB-Slave-01', ip: '192.168.1.302', status: 'online', cpu: 65, memory: 72 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: '华南数据中心',
    ip: '192.168.2.0',
    status: 'online',
    cpu: 38,
    memory: 55,
    children: [
      {
        id: '2-1',
        name: 'Web 服务器组 A',
        ip: '192.168.2.1',
        status: 'online',
        cpu: 40,
        memory: 52,
        children: [
          { id: '2-1-1', name: 'Web-01', ip: '192.168.2.101', status: 'online', cpu: 32, memory: 48 },
          { id: '2-1-2', name: 'Web-02', ip: '192.168.2.102', status: 'online', cpu: 45, memory: 55 },
        ],
      },
      {
        id: '2-2',
        name: '应用服务器组 B',
        ip: '192.168.2.2',
        status: 'online',
        cpu: 35,
        memory: 58,
        children: [
          { id: '2-2-1', name: 'App-01', ip: '192.168.2.201', status: 'online', cpu: 38, memory: 60 },
        ],
      },
    ],
  },
])
// @core-end

const instructions = [
  '数据源需要包含 children 属性来表示层级关系',
  '第一列会自动展示展开/收起图标',
  '支持任意层级的树形结构',
  '可以通过插槽自定义单元格内容',
  '分页默认关闭，适合展示完整的树形数据',
]

// 代码字符串 - 使用数组拼接避免模板字符串中的结束标签问题
const coreCodeParts = [
  '<template>\n  <TreeTable\n',
  '    :columns="columns"\n',
  '    :data-source="dataSource"\n',
  '  >\n    <template #status="{ record }">\n',
  '      <a-badge :status="record.status" />\n    </template>\n',
  '  </TreeTable>\n</template>\n\n',
  '<script setup lang="ts">\n',
  'const columns = [\n',
  '  { title: \'名称\', dataIndex: \'name\' },\n',
  '  { title: \'IP\', dataIndex: \'ip\' },\n',
  '  // ...\n]\n\n',
  'const dataSource = ref([\n',
  '  {\n',
  '    id: \'1\',\n',
  '    name: \'父节点\',\n',
  '    children: [\n',
  '      { id: \'1-1\', name: \'子节点1\' },\n',
  '      { id: \'1-2\', name: \'子节点2\' },\n',
  '    ]\n',
  '  },\n',
  '  // ...\n',
  '])\n',
  '<' + '/script>\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'
</script>

<style scoped lang="less">
.tree-table-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}
</style>
