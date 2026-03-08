<template>
  <div class="editable-table-demo">
    <!-- @core: 核心演示代码 -->
    <EditableTable
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      @update:dataSource="handleDataChange"
    >
      <template #age="{ record }">
        <span>{{ record.age }} 岁</span>
      </template>
    </EditableTable>
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
      filename="EditableTableDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// @core: 核心配置代码
interface User {
  id: number
  name: string
  email: string
  age: number
  department: string
}

const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', editable: true },
  { title: '邮箱', dataIndex: 'email', key: 'email', editable: true },
  { title: '年龄', dataIndex: 'age', key: 'age', slot: 'age' },
  { title: '部门', dataIndex: 'department', key: 'department', editable: true },
]

const dataSource = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 28, department: '技术部' },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 32, department: '产品部' },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 25, department: '设计部' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', age: 30, department: '运营部' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', age: 27, department: '市场部' },
])
// @core-end

const instructions = [
  '在 columns 配置中设置 editable: true 启用单元格编辑',
  '点击可编辑的单元格进入编辑模式',
  '编辑后按回车键或点击其他区域保存',
  '支持取消编辑，恢复原始数据',
  '通过 v-model:dataSource 或 @update:dataSource 获取更新后的数据',
]

// 代码字符串 - 使用数组拼接避免模板字符串中的结束标签问题
const coreCodeParts = [
  '<template>\n  <EditableTable\n    :columns="columns"\n',
  '    :data-source="dataSource"\n',
  '    @update:dataSource="handleDataChange"\n',
  '  />\n</template>\n\n',
  '<script setup lang="ts">\n',
  'const columns = [\n',
  '  { title: \'姓名\', dataIndex: \'name\', editable: true },\n',
  '  { title: \'邮箱\', dataIndex: \'email\', editable: true },\n',
  '  { title: \'部门\', dataIndex: \'department\', editable: true },\n',
  ']\n\n',
  'const dataSource = ref([\n',
  '  { id: 1, name: \'张三\', email: \'zhangsan@example.com\', ... },\n',
  '  // ...\n',
  '])\n',
  '<' + '/script>\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'

// 操作处理函数
function handleDataChange(data: User[]) {
  console.log('数据已更新:', data)
  message.success('数据更新成功')
}
</script>

<style scoped lang="less">
.editable-table-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}
</style>
