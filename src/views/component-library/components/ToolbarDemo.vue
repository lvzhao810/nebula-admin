<template>
  <div class="toolbar-demo">
    <Toolbar
      :buttons="toolbarButtons"
      :show-refresh="true"
      @click="handleButtonClick"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import Toolbar from '@/components/common/Toolbar.vue'
import type { ToolbarButton } from '@/components/common/Toolbar.vue'

const toolbarButtons: ToolbarButton[] = [
  { key: 'add', label: '新增', type: 'primary', icon: 'PlusOutlined' },
  { key: 'edit', label: '编辑', type: 'default', icon: 'EditOutlined' },
  { key: 'delete', label: '删除', type: 'default', danger: true, icon: 'DeleteOutlined' },
]

const handleButtonClick = (button: any) => {
  message.info(`点击了 ${button.label} 按钮`)
}

const handleRefresh = () => {
  message.info('刷新列表')
}
</script>
