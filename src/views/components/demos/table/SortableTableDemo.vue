<template>
  <div class="sortable-table-demo">
    <!-- @core: 核心演示代码 -->
    <SortableTable
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      @update:dataSource="handleDataChange"
    >
      <template #status="{ record }">
        <a-tag :color="record.status === '已完成' ? 'green' : record.status === '进行中' ? 'blue' : 'orange'">
          {{ record.status }}
        </a-tag>
      </template>
      <template #priority="{ record }">
        <a-tag :color="record.priority === '高' ? 'red' : record.priority === '中' ? 'orange' : 'default'">
          {{ record.priority }}
        </a-tag>
      </template>
    </SortableTable>
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
      filename="SortableTableDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// @core: 核心配置代码
interface Task {
  id: number
  name: string
  assignee: string
  status: string
  priority: string
  deadline: string
}

const columns = [
  { title: '任务名称', dataIndex: 'name', key: 'name' },
  { title: '负责人', dataIndex: 'assignee', key: 'assignee' },
  { title: '状态', dataIndex: 'status', key: 'status', slot: 'status' },
  { title: '优先级', dataIndex: 'priority', key: 'priority', slot: 'priority' },
  { title: '截止日期', dataIndex: 'deadline', key: 'deadline' },
]

const dataSource = ref<Task[]>([
  { id: 1, name: '完成首页设计', assignee: '张三', status: '进行中', priority: '高', deadline: '2024-02-15' },
  { id: 2, name: '开发用户模块', assignee: '李四', status: '待开始', priority: '高', deadline: '2024-02-20' },
  { id: 3, name: '编写测试用例', assignee: '王五', status: '已完成', priority: '中', deadline: '2024-02-10' },
  { id: 4, name: '性能优化', assignee: '赵六', status: '进行中', priority: '中', deadline: '2024-02-25' },
  { id: 5, name: '文档编写', assignee: '孙七', status: '待开始', priority: '低', deadline: '2024-02-28' },
  { id: 6, name: '数据库迁移', assignee: '周八', status: '待开始', priority: '高', deadline: '2024-02-18' },
])
// @core-end

const instructions = [
  '拖拽行左侧的把手或直接拖拽整行进行排序',
  '拖拽过程中会显示视觉反馈',
  '松开鼠标后完成排序',
  '通过 v-model:dataSource 或 @update:dataSource 获取排序后的数据',
  '支持插槽自定义列内容显示',
]

// 代码字符串 - 使用数组拼接避免模板字符串中的结束标签问题
const coreCodeParts = [
  '<template>\n  <SortableTable\n',
  '    :columns="columns"\n',
  '    :data-source="dataSource"\n',
  '    @update:dataSource="handleDataChange"\n',
  '  >\n    <template #status="{ record }">\n',
  '      <a-tag :color="getStatusColor(record.status)">\n',
  '        {{ record.status }}\n',
  '      </a-tag>\n    </template>\n',
  '  </SortableTable>\n</template>\n\n',
  '<script setup lang="ts">\n',
  'const columns = [\n',
  '  { title: \'任务名称\', dataIndex: \'name\' },\n',
  '  { title: \'负责人\', dataIndex: \'assignee\' },\n',
  '  // ...\n]\n\n',
  'const dataSource = ref([\n',
  '  { id: 1, name: \'任务1\', ... },\n',
  '  // ...\n',
  '])\n',
  '<' + '/script>\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'

// 操作处理函数
function handleDataChange(data: Task[]) {
  console.log('顺序已更新:', data.map((item) => item.name))
  message.success('排序已更新')
}
</script>

<style scoped lang="less">
.sortable-table-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}
</style>
