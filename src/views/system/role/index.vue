<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">角色管理</h1>
    </div>

    <!-- 搜索栏 -->
    <a-card class="shadow-card">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="角色名称">
          <a-input v-model:value="searchForm.roleName" placeholder="请输入角色名称" allow-clear />
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
    <ProTable
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      row-key="id"
      @refresh="fetchData"
      @change="handleTableChange"
    >
      <template #toolbar-left>
        <a-button type="primary" class="!bg-gradient-nebula !border-0" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增角色
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'error'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'permissions'">
          <a-tag v-for="perm in record.permissions?.slice(0, 2)" :key="perm" class="mb-1">
            {{ perm }}
          </a-tag>
          <span v-if="record.permissions && record.permissions.length > 2">
            +{{ record.permissions.length - 2 }}
          </span>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" size="small" @click="handlePermission(record)">权限配置</a-button>
            <a-button type="link" size="small" :danger="true" @click="handleDelete(record)">删除</a-button>
          </a-space>
        </template>
      </template>
    </ProTable>

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
        <a-form-item label="角色名称" name="roleName">
          <a-input v-model:value="formData.roleName" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色编码" name="roleCode">
          <a-input v-model:value="formData.roleCode" placeholder="请输入角色编码" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="formData.description" placeholder="请输入描述" :rows="3" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限配置弹窗 -->
    <a-modal
      v-model:open="permissionModalVisible"
      title="权限配置"
      :width="600"
      @ok="handlePermissionOk"
    >
      <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="(permissionTree as any)"
        :field-names="{ children: 'children', title: 'title', key: 'id' }"
        class="mt-4"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import ProTable from '@/components/common/ProTable.vue'
import type { TableColumnType, TreeProps, TablePaginationConfig, FormInstance } from 'ant-design-vue'
import type { Role } from '@/types'
import type { RuleObject } from 'ant-design-vue/es/form/interface'

// 权限树节点类型
interface PermissionNode {
  id: string
  title: string
  children?: PermissionNode[]
  [key: string]: any
}

// 搜索表单
const searchForm = reactive({
  roleName: '',
})

// 表格数据
const dataSource = ref<Role[]>([])
const loading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 表格列
const columns: TableColumnType[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode',
    key: 'roleCode',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '权限',
    key: 'permissions',
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
    width: 200,
    fixed: 'right',
  },
]

// 弹窗
const modalVisible = ref(false)
const modalTitle = computed(() => (isEdit.value ? '编辑角色' : '新增角色'))
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  id: undefined as number | undefined,
  roleName: '',
  roleCode: '',
  description: '',
  status: 1,
})

// 表单规则
const formRules: Record<string, RuleObject[]> = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

// 权限配置弹窗
const permissionModalVisible = ref(false)
const currentRole = ref<Role | null>(null)
const checkedKeys = ref<TreeProps['checkedKeys']>([])

// 权限树数据
const permissionTree: PermissionNode[] = [
  {
    id: 'system',
    title: '系统管理',
    children: [
      {
        id: 'system:user:view',
        title: '用户管理-查看',
      },
      {
        id: 'system:user:add',
        title: '用户管理-新增',
      },
      {
        id: 'system:user:edit',
        title: '用户管理-编辑',
      },
      {
        id: 'system:user:delete',
        title: '用户管理-删除',
      },
      {
        id: 'system:role:view',
        title: '角色管理-查看',
      },
      {
        id: 'system:role:add',
        title: '角色管理-新增',
      },
      {
        id: 'system:role:edit',
        title: '角色管理-编辑',
      },
      {
        id: 'system:role:delete',
        title: '角色管理-删除',
      },
      {
        id: 'system:menu:view',
        title: '菜单管理-查看',
      },
      {
        id: 'system:menu:add',
        title: '菜单管理-新增',
      },
      {
        id: 'system:menu:edit',
        title: '菜单管理-编辑',
      },
      {
        id: 'system:menu:delete',
        title: '菜单管理-删除',
      },
    ],
  },
]

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟 API 请求
    await new Promise((resolve) => setTimeout(resolve, 500))
    dataSource.value = [
      {
        id: 1,
        roleName: '超级管理员',
        roleCode: 'admin',
        description: '拥有系统所有权限',
        status: 1,
        permissions: ['系统管理', '用户管理', '角色管理'],
        createTime: '2024-01-01',
      },
      {
        id: 2,
        roleName: '普通用户',
        roleCode: 'user',
        description: '普通用户权限',
        status: 1,
        permissions: ['用户管理-查看'],
        createTime: '2024-01-15',
      },
      {
        id: 3,
        roleName: '访客',
        roleCode: 'guest',
        description: '访客权限',
        status: 1,
        permissions: [],
        createTime: '2024-02-01',
      },
    ]
    pagination.total = 3
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.roleName = ''
  fetchData()
}

// 表格变化
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchData()
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  modalVisible.value = true
  resetForm()
}

// 编辑
const handleEdit = (record: Record<string, any>) => {
  isEdit.value = true
  modalVisible.value = true
  Object.assign(formData, {
    id: record.id,
    roleName: record.roleName,
    roleCode: record.roleCode,
    description: record.description,
    status: record.status,
  })
}

// 权限配置
const handlePermission = (record: Record<string, any>) => {
  currentRole.value = record as Role
  checkedKeys.value = record.permissions || []
  permissionModalVisible.value = true
}

// 删除
const handleDelete = (record: Record<string, any>) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除角色 "${record.roleName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        // 模拟 API 请求
        await new Promise((resolve) => setTimeout(resolve, 500))
        message.success('删除成功')
        fetchData()
      } catch (error) {
        message.error('删除失败')
      }
    },
  })
}

// 弹窗确定
const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    // 模拟 API 请求
    await new Promise((resolve) => setTimeout(resolve, 500))
    message.success(isEdit.value ? '修改成功' : '新增成功')
    modalVisible.value = false
    fetchData()
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 权限配置确定
const handlePermissionOk = async () => {
  try {
    // 模拟 API 请求
    await new Promise((resolve) => setTimeout(resolve, 500))
    message.success('权限配置成功')
    permissionModalVisible.value = false
    fetchData()
  } catch (error) {
    message.error('权限配置失败')
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    roleName: '',
    roleCode: '',
    description: '',
    status: 1,
  })
  formRef.value?.clearValidate()
}

onMounted(() => {
  fetchData()
})
</script>
