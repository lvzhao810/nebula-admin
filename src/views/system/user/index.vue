<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">用户管理</h1>
      <a-button type="primary" class="!bg-gradient-nebula !border-0" @click="handleAdd">
        <template #icon><PlusOutlined /></template>
        新增用户
      </a-button>
    </div>

    <!-- 搜索栏 -->
    <a-card class="shadow-card">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="用户名">
          <a-input v-model:value="searchForm.username" placeholder="请输入用户名" allow-clear />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchForm.status" placeholder="请选择状态" allow-clear style="width: 120px">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 表格 -->
    <a-card class="shadow-card">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :size="32" class="bg-gradient-nebula">
              {{ record.username?.charAt(0).toUpperCase() }}
            </a-avatar>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'success' : 'error'">
              {{ record.status === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" size="small" :danger="true" @click="handleDelete(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="500"
      @ok="handleModalOk"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        class="mt-4"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="密码" name="password" v-if="!isEdit">
          <a-input-password v-model:value="formData.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="角色" name="roleId">
          <a-select v-model:value="formData.roleId" placeholder="请选择角色">
            <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useTable } from '@/composables/useTable'
import { useFormModal } from '@/composables/useFormModal'
import type { RuleObject } from 'ant-design-vue/es/form/interface'

// Search form
const searchForm = reactive({
  username: '',
  status: undefined as number | undefined,
})

// Table columns
const columns: TableColumnType[] = [
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

// Roles
const roles = [
  { id: 1, name: '超级管理员' },
  { id: 2, name: '普通用户' },
  { id: 3, name: '访客' },
]

// Mock data fetcher
const fetchUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      email: 'admin@nebula.com',
      status: 1,
      roleId: 1,
      roleName: '超级管理员',
      createTime: '2024-01-01',
    },
    {
      id: 2,
      username: 'zhangsan',
      nickname: '张三',
      email: 'zhangsan@nebula.com',
      status: 1,
      roleId: 2,
      roleName: '普通用户',
      createTime: '2024-01-15',
    },
    {
      id: 3,
      username: 'lisi',
      nickname: '李四',
      email: 'lisi@nebula.com',
      status: 0,
      roleId: 2,
      roleName: '普通用户',
      createTime: '2024-01-20',
    },
    {
      id: 4,
      username: 'wangwu',
      nickname: '王五',
      email: 'wangwu@nebula.com',
      status: 1,
      roleId: 3,
      roleName: '访客',
      createTime: '2024-02-01',
    },
    {
      id: 5,
      username: 'zhaoliu',
      nickname: '赵六',
      email: 'zhaoliu@nebula.com',
      status: 1,
      roleId: 2,
      roleName: '普通用户',
      createTime: '2024-02-10',
    },
  ]
}

const { dataSource, loading, pagination, fetchData, handleTableChange } = useTable(fetchUsers)

// Form
const formRules: Record<string, RuleObject[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const initialFormData = {
  id: undefined as number | undefined,
  username: '',
  nickname: '',
  email: '',
  password: '',
  roleId: undefined as number | undefined,
  status: 1,
}

const { visible: modalVisible, formRef, formData, isEdit, open: openModal, close: closeModal } = useFormModal(initialFormData)

// Custom modal title with '用户' suffix
const modalTitle = computed(() => (isEdit.value ? '编辑用户' : '新增用户'))

// Handlers
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.status = undefined
  fetchData()
}

const handleAdd = () => {
  openModal()
}

const handleEdit = (record: Record<string, any>) => {
  openModal(record)
}

const handleDelete = (record: Record<string, any>) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${record.username}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        message.success('删除成功')
        fetchData()
      } catch {
        message.error('删除失败')
      }
    },
  })
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    await new Promise((resolve) => setTimeout(resolve, 500))
    message.success(isEdit.value ? '修改成功' : '新增成功')
    closeModal()
    fetchData()
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

onMounted(fetchData)
</script>
