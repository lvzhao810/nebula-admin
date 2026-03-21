<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">菜单管理</h1>
    </div>

    <!-- 菜单表格 -->
    <ProTable
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :loading="loading"
      row-key="id"
      @refresh="fetchData"
    >
      <template #toolbar-left>
        <a-button type="primary" class="!bg-gradient-nebula !border-0" @click="handleAdd(null)">
          <template #icon><PlusOutlined /></template>
          新增菜单
        </a-button>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <component :is="record.icon" class="text-lg" />
        </template>
        <template v-else-if="column.key === 'type'">
          <a-tag :color="getTypeColor(record.type)">
            {{ getTypeName(record.type) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'error'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleAdd(record as any)">新增子菜单</a-button>
            <a-button type="link" size="small" @click="handleEdit(record as any)">编辑</a-button>
            <a-button type="link" size="small" :danger="true" @click="handleDelete(record as any)">删除</a-button>
          </a-space>
        </template>
      </template>
    </ProTable>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="600"
      @ok="handleModalOk"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        class="mt-4"
      >
        <a-form-item label="上级菜单" name="parentId">
          <a-tree-select
            v-model:value="formData.parentId"
            :tree-data="menuTree"
            allow-clear
            placeholder="请选择上级菜单"
            :field-names="{ label: 'title', value: 'id', children: 'children' }"
          />
        </a-form-item>
        <a-form-item label="菜单类型" name="type">
          <a-radio-group v-model:value="formData.type">
            <a-radio :value="1">目录</a-radio>
            <a-radio :value="2">菜单</a-radio>
            <a-radio :value="3">按钮</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="菜单名称" name="title">
          <a-input v-model:value="formData.title" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item label="路由路径" name="path" v-if="formData.type !== 3">
          <a-input v-model:value="formData.path" placeholder="请输入路由路径" />
        </a-form-item>
        <a-form-item label="组件路径" name="component" v-if="formData.type === 2">
          <a-input v-model:value="formData.component" placeholder="请输入组件路径" />
        </a-form-item>
        <a-form-item label="图标" name="icon" v-if="formData.type !== 3">
          <a-select v-model:value="formData.icon" placeholder="请选择图标" show-search :filter-option="filterIconOption">
            <a-select-option v-for="icon in iconList" :key="icon.value" :value="icon.value">
              <component :is="icon.value" class="mr-2" />
              {{ icon.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="权限标识" name="permission" v-if="formData.type === 3">
          <a-input v-model:value="formData.permission" placeholder="请输入权限标识，如：system:user:add" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="formData.sort" :min="0" :max="999" style="width: 100%" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import ProTable from '@/components/common/ProTable.vue'
import type { FormInstance } from 'ant-design-vue'
import type { MenuItem } from '@/types'

// 表格数据
const dataSource = ref<MenuItem[]>([])
const loading = ref(false)

// 表格列
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '图标',
    key: 'icon',
    width: 80,
    align: 'center' as const,
  },
  {
    title: '类型',
    key: 'type',
    width: 100,
  },
  {
    title: '路由路径',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    key: 'component',
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    key: 'permission',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 80,
    align: 'center' as const,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    fixed: 'right' as const,
  },
]

// 弹窗
const modalVisible = ref(false)
const modalTitle = computed(() => (isEdit.value ? '编辑菜单' : '新增菜单'))
const isEdit = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  id: undefined as number | undefined,
  parentId: undefined as number | undefined,
  type: 1,
  title: '',
  path: '',
  component: '',
  icon: '',
  permission: '',
  sort: 0,
  status: 1,
})

// 表单规则
const formRules: Record<string, any[]> = {
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' },
  ],
  permission: [
    { required: true, message: '请输入权限标识', trigger: 'blur' },
  ],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
}

// 图标列表
const iconList = [
  { label: 'Dashboard', value: 'DashboardOutlined' },
  { label: '用户', value: 'UserOutlined' },
  { label: '团队', value: 'TeamOutlined' },
  { label: '菜单', value: 'MenuOutlined' },
  { label: '设置', value: 'SettingOutlined' },
  { label: '首页', value: 'HomeOutlined' },
  { label: '分析', value: 'AnalysisOutlined' },
  { label: '文件', value: 'FileOutlined' },
  { label: '文件夹', value: 'FolderOutlined' },
  { label: '图片', value: 'PictureOutlined' },
  { label: '视频', value: 'VideoCameraOutlined' },
  { label: '日历', value: 'CalendarOutlined' },
  { label: '时钟', value: 'ClockCircleOutlined' },
  { label: '通知', value: 'BellOutlined' },
  { label: '消息', value: 'MessageOutlined' },
  { label: '搜索', value: 'SearchOutlined' },
  { label: '收藏', value: 'StarOutlined' },
  { label: '心形', value: 'HeartOutlined' },
  { label: '购物车', value: 'ShoppingCartOutlined' },
  { label: '钱包', value: 'WalletOutlined' },
  { label: '图表', value: 'BarChartOutlined' },
  { label: '柱状图', value: 'ColumnHeightOutlined' },
  { label: '折线图', value: 'LineChartOutlined' },
  { label: '饼图', value: 'PieChartOutlined' },
  { label: '代码', value: 'CodeOutlined' },
  { label: '数据库', value: 'DatabaseOutlined' },
  { label: '服务器', value: 'ServerOutlined' },
  { label: '安全', value: 'SafetyCertificateOutlined' },
  { label: '锁', value: 'LockOutlined' },
  { label: '钥匙', value: 'KeyOutlined' },
]

// 菜单树（用于选择上级菜单）
const menuTree = computed(() => {
  return [
    {
      id: undefined,
      title: '顶级菜单',
      children: dataSource.value,
    },
  ]
})

// 获取类型颜色
const getTypeColor = (type: number) => {
  const colorMap: Record<number, string> = {
    1: 'blue',
    2: 'success',
    3: 'orange',
  }
  return colorMap[type] || 'default'
}

// 获取类型名称
const getTypeName = (type: number) => {
  const nameMap: Record<number, string> = {
    1: '目录',
    2: '菜单',
    3: '按钮',
  }
  return nameMap[type] || '未知'
}

// 图标过滤
const filterIconOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟 API 请求
    await new Promise((resolve) => setTimeout(resolve, 500))
    dataSource.value = [
      {
        id: 1,
        title: '系统管理',
        path: '/system',
        icon: 'SettingOutlined',
        type: 1,
        sort: 1,
        status: 1,
        children: [
          {
            id: 11,
            parentId: 1,
            title: '用户管理',
            path: '/system/user',
            component: '@/views/system/user/index.vue',
            icon: 'UserOutlined',
            type: 2,
            sort: 1,
            status: 1,
            children: [
              {
                id: 111,
                parentId: 11,
                title: '查看',
                path: '',
                permission: 'system:user:view',
                type: 3,
                sort: 1,
                status: 1,
              },
              {
                id: 112,
                parentId: 11,
                title: '新增',
                path: '',
                permission: 'system:user:add',
                type: 3,
                sort: 2,
                status: 1,
              },
              {
                id: 113,
                parentId: 11,
                title: '编辑',
                path: '',
                permission: 'system:user:edit',
                type: 3,
                sort: 3,
                status: 1,
              },
              {
                id: 114,
                parentId: 11,
                title: '删除',
                path: '',
                permission: 'system:user:delete',
                type: 3,
                sort: 4,
                status: 1,
              },
            ],
          },
          {
            id: 12,
            parentId: 1,
            title: '角色管理',
            path: '/system/role',
            component: '@/views/system/role/index.vue',
            icon: 'TeamOutlined',
            type: 2,
            sort: 2,
            status: 1,
          },
          {
            id: 13,
            parentId: 1,
            title: '菜单管理',
            path: '/system/menu',
            component: '@/views/system/menu/index.vue',
            icon: 'MenuOutlined',
            type: 2,
            sort: 3,
            status: 1,
          },
        ],
      },
    ]
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = (record: MenuItem | null) => {
  isEdit.value = false
  modalVisible.value = true
  resetForm()
  if (record) {
    formData.parentId = record.id as number
  }
}

// 编辑
const handleEdit = (record: MenuItem) => {
  isEdit.value = true
  modalVisible.value = true
  Object.assign(formData, {
    id: record.id,
    parentId: record.parentId,
    type: record.type,
    title: record.title,
    path: record.path,
    component: record.component,
    icon: record.icon,
    permission: record.permission,
    sort: record.sort,
    status: record.status,
  })
}

// 删除
const handleDelete = (record: MenuItem) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除菜单 "${record.title}" 吗？`,
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

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    parentId: undefined,
    type: 1,
    title: '',
    path: '',
    component: '',
    icon: '',
    permission: '',
    sort: 0,
    status: 1,
  })
  formRef.value?.clearValidate()
}

onMounted(() => {
  fetchData()
})
</script>
