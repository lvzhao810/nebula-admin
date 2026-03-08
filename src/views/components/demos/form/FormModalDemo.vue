<template>
  <div class="form-modal-demo">
    <!-- @core: 核心演示代码 -->
    <a-card title="FormModal 表单弹窗演示" class="shadow-card">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert
          message="表单弹窗组件"
          description="FormModal 是一个基于 Ant Design Vue Modal 封装的表单弹窗组件，支持多种表单项类型。"
          type="info"
          show-icon
        />

        <a-space>
          <a-button type="primary" @click="openAddModal">
            <template #icon><PlusOutlined /></template>
            新增用户
          </a-button>
          <a-button @click="openEditModal">
            <template #icon><EditOutlined /></template>
            编辑用户
          </a-button>
        </a-space>

        <!-- 最近操作记录 -->
        <a-descriptions title="最近操作" bordered size="small" :column="1">
          <a-descriptions-item label="操作记录">
            <a-timeline size="small">
              <a-timeline-item v-for="log in actionLogs" :key="log.id">
                {{ log.action }} - {{ log.time }}
              </a-timeline-item>
            </a-timeline>
          </a-descriptions-item>
        </a-descriptions>
      </a-space>
    </a-card>

    <!-- 新增用户弹窗 -->
    <FormModal
      v-model:visible="addModalVisible"
      v-model:formData="addFormData"
      title="新增用户"
      icon="UserAddOutlined"
      :form-items="userFormItems"
      :rules="formRules"
      :loading="submitLoading"
      @ok="handleAddUser"
    >
      <template #form="{ form }">
        <a-form-item label="头像" name="avatar">
          <a-upload
            v-model:file-list="avatarList"
            list-type="picture-card"
            :max-count="1"
          >
            <PlusOutlined />
          </a-upload>
        </a-form-item>
      </template>
    </FormModal>

    <!-- 编辑用户弹窗 -->
    <FormModal
      v-model:visible="editModalVisible"
      v-model:formData="editFormData"
      title="编辑用户"
      icon="EditOutlined"
      :form-items="userFormItems"
      :rules="formRules"
      :loading="submitLoading"
      @ok="handleEditUser"
    />
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
      filename="FormModalDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PlusOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
// FormModal 通过 unplugin-vue-components 自动导入
import CodeViewer from '@/components/common/CodeViewer.vue'

// @core: 核心配置代码
const addModalVisible = ref(false)
const editModalVisible = ref(false)
const submitLoading = ref(false)

const userFormItems = [
  { name: 'username', label: '用户名', type: 'input', placeholder: '请输入用户名' },
  { name: 'email', label: '邮箱', type: 'input', placeholder: '请输入邮箱' },
  { name: 'role', label: '角色', type: 'select', placeholder: '请选择角色', options: [
    { label: '管理员', value: 'admin' },
    { label: '普通用户', value: 'user' },
  ]},
  { name: 'status', label: '状态', type: 'switch', checkedChildren: '启用', unCheckedChildren: '禁用' },
  { name: 'remark', label: '备注', type: 'textarea', placeholder: '请输入备注', rows: 3 },
]

const formRules = {
  username: [{ required: true, message: '请输入用户名' }],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  role: [{ required: true, message: '请选择角色' }],
}

let addFormData = reactive({
  username: '',
  email: '',
  role: undefined,
  status: true,
  remark: '',
})

let editFormData = reactive({
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  status: true,
  remark: '系统管理员',
})

const avatarList = ref([])

const actionLogs = ref<Array<{ id: number; action: string; time: string }>>([])

function openAddModal() {
  addModalVisible.value = true
}

function openEditModal() {
  editModalVisible.value = true
}

async function handleAddUser() {
  submitLoading.value = true
  setTimeout(() => {
    submitLoading.value = false
    addModalVisible.value = false
    message.success('用户添加成功')
    addLog('新增用户: '.concat(addFormData.username))
    Object.assign(addFormData, {
      username: '',
      email: '',
      role: undefined,
      status: true,
      remark: '',
    })
  }, 1000)
}

async function handleEditUser() {
  submitLoading.value = true
  setTimeout(() => {
    submitLoading.value = false
    editModalVisible.value = false
    message.success('用户更新成功')
    addLog('编辑用户: '.concat(editFormData.username))
  }, 1000)
}

function addLog(action: string) {
  actionLogs.value.unshift({
    id: Date.now(),
    action,
    time: new Date().toLocaleTimeString(),
  })
  if (actionLogs.value.length > 5) {
    actionLogs.value.pop()
  }
}
// @core-end

const instructions = [
  '使用 v-model:visible 控制弹窗显示/隐藏',
  '使用 v-model:formData 双向绑定表单数据',
  '通过 form-items 配置表单项，支持多种类型',
  '通过 rules 配置表单验证规则',
  '支持自定义表单插槽，可插入任意表单项',
]

// 代码字符串
const coreCodeParts = [
  '<template>\n  <a-button type="primary" @click="addModalVisible = true">\n',
  '    新增用户\n  </a-button>\n\n',
  '  <FormModal\n    v-model:visible="addModalVisible"\n',
  '    v-model:formData="addFormData"\n    title="新增用户"\n',
  '    :form-items="userFormItems"\n    :rules="formRules"\n',
  '    :loading="submitLoading"\n    @ok="handleAddUser"\n',
  '  />\n</template>\n\n',
  '<script setup lang="ts">\n',
  'const userFormItems = [\n',
  '  { name: \'username\', label: \'用户名\', type: \'input\' },\n',
  '  { name: \'email\', label: \'邮箱\', type: \'input\' },\n',
  '  { name: \'role\', label: \'角色\', type: \'select\', options: [...] },\n',
  '  { name: \'status\', label: \'状态\', type: \'switch\' },\n',
  ']\n\n',
  'const formRules = {\n',
  '  username: [{ required: true, message: \'请输入用户名\' }],\n',
  '  email: [{ required: true, type: \'email\' }],\n',
  '}\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'
</script>

<style scoped lang="less">
.form-modal-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}
</style>
