<template>
  <div class="icon-select">
    <a-select
      v-model:value="selectedIcon"
      placeholder="请选择图标"
      show-search
      :filter-option="filterIconOption"
      allow-clear
      style="width: 100%"
    >
      <template #suffixIcon><SearchOutlined /></template>
      <a-select-option v-for="icon in iconList" :key="icon.value" :value="icon.value">
        <div class="flex items-center">
          <component :is="getIconComponent(icon.value)" class="mr-2 text-lg" />
          <span>{{ icon.label }}</span>
        </div>
      </a-select-option>
    </a-select>

    <!-- 图标预览 -->
    <div v-if="selectedIcon" class="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-center">
      <component :is="getIconComponent(selectedIcon)" class="text-4xl text-nebula-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import * as AllIcons from '@ant-design/icons-vue'

interface IconOption {
  label: string
  value: string
  component?: any
}

interface Props {
  value?: string
  icons?: IconOption[]
}

const props = withDefaults(defineProps<Props>(), {
  icons: () => [
    { label: 'Dashboard', value: 'DashboardOutlined' },
    { label: '首页', value: 'HomeOutlined' },
    { label: '用户', value: 'UserOutlined' },
    { label: '团队', value: 'TeamOutlined' },
    { label: '菜单', value: 'MenuOutlined' },
    { label: '设置', value: 'SettingOutlined' },
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
    { label: '编辑', value: 'EditOutlined' },
    { label: '删除', value: 'DeleteOutlined' },
    { label: '新增', value: 'PlusOutlined' },
    { label: '查看', value: 'EyeOutlined' },
    { label: '下载', value: 'DownloadOutlined' },
    { label: '上传', value: 'UploadOutlined' },
    { label: '复制', value: 'CopyOutlined' },
    { label: '检查', value: 'CheckOutlined' },
    { label: '关闭', value: 'CloseOutlined' },
  ],
})

const emit = defineEmits<{
  'update:value': [value: string]
  change: [value: string]
}>()

const selectedIcon = ref<string>()

// 监听 value 变化
watch(() => props.value, (val) => {
  selectedIcon.value = val
}, { immediate: true })

// 监听选择变化
watch(selectedIcon, (val) => {
  emit('update:value', val || '')
  emit('change', val || '')
})

// 解析图标组件
const getIconComponent = (iconName: string) => {
  const Icon = (AllIcons as any)[iconName]
  return Icon ? h(Icon) : undefined
}

// 图标过滤
const filterIconOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

// 图标列表
const iconList = computed(() => {
  return props.icons.length > 0 ? props.icons : [
    { label: 'Dashboard', value: 'DashboardOutlined' },
    { label: '首页', value: 'HomeOutlined' },
    { label: '用户', value: 'UserOutlined' },
    { label: '团队', value: 'TeamOutlined' },
    { label: '菜单', value: 'MenuOutlined' },
    { label: '设置', value: 'SettingOutlined' },
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
    { label: '编辑', value: 'EditOutlined' },
    { label: '删除', value: 'DeleteOutlined' },
    { label: '新增', value: 'PlusOutlined' },
    { label: '查看', value: 'EyeOutlined' },
    { label: '下载', value: 'DownloadOutlined' },
    { label: '上传', value: 'UploadOutlined' },
    { label: '复制', value: 'CopyOutlined' },
    { label: '检查', value: 'CheckOutlined' },
    { label: '关闭', value: 'CloseOutlined' },
  ]
})
</script>
