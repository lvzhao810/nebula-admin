<template>
  <div class="toolbar-demo">
    <!-- @core: 核心演示代码 -->
    <a-card title="Toolbar 工具栏演示" class="shadow-card">
      <a-space direction="vertical" :size="24" style="width: 100%">
        <a-alert
          message="工具栏组件"
          description="Toolbar 是一个表格工具栏组件，支持左侧操作按钮和右侧功能按钮。"
          type="info"
          show-icon
        />

        <!-- 基础工具栏 -->
        <a-card title="基础工具栏" size="small">
          <Toolbar
            :buttons="toolbarButtons"
            @click="handleToolbarClick"
          />
        </a-card>

        <!-- 带刷新的工具栏 -->
        <a-card title="带刷新的工具栏" size="small">
          <Toolbar
            :buttons="toolbarButtons"
            :show-refresh="true"
            @click="handleToolbarClick"
            @refresh="handleRefresh"
          />
        </a-card>

        <!-- 使用插槽的工具栏 -->
        <a-card title="使用插槽的工具栏" size="small">
          <Toolbar
            :buttons="[]"
            :show-refresh="true"
            @refresh="handleRefresh"
          >
            <template #left>
              <a-space>
                <a-button type="primary" @click="handleAdd">
                  <template #icon><PlusOutlined /></template>
                  新增
                </a-button>
                <a-button @click="handleImport">
                  <template #icon><UploadOutlined /></template>
                  导入
                </a-button>
              </a-space>
            </template>
            <template #right>
              <a-dropdown>
                <a-button>
                  更多
                  <DownOutlined />
                </a-button>
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item key="export">导出数据</a-menu-item>
                    <a-menu-item key="config">列设置</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </Toolbar>
        </a-card>

        <!-- 操作记录 -->
        <a-card title="操作记录" size="small">
          <a-timeline>
            <a-timeline-item v-for="log in actionLogs" :key="log.id">
              <a-tag :color="log.color">{{ log.action }}</a-tag>
              <span class="ml-2">{{ log.time }}</span>
            </a-timeline-item>
            <a-timeline-item v-if="actionLogs.length === 0">
              <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="暂无操作记录" />
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-space>
    </a-card>
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
      filename="ToolbarDemo.vue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PlusOutlined, UploadOutlined, DownOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { Empty, message } from 'ant-design-vue'
// Toolbar 通过 unplugin-vue-components 自动导入
import CodeViewer from '@/components/common/CodeViewer.vue'

interface ActionLog {
  id: number
  action: string
  time: string
  color: string
}

// @core: 核心配置代码
const toolbarButtons = [
  { key: 'add', label: '新增', type: 'primary', icon: 'PlusOutlined' },
  { key: 'edit', label: '编辑', type: 'default', icon: 'EditOutlined' },
  { key: 'delete', label: '删除', type: 'default', danger: true, icon: 'DeleteOutlined' },
]

const actionLogs = ref<ActionLog[]>([])

function handleToolbarClick(button: any) {
  const logMap: Record<string, { action: string; color: string }> = {
    add: { action: '新增操作', color: 'blue' },
    edit: { action: '编辑操作', color: 'orange' },
    delete: { action: '删除操作', color: 'red' },
  }

  const log = logMap[button.key]
  if (log) {
    addLog(log.action, log.color)
    message.success('点击了: '.concat(button.label))
  }
}

function handleRefresh() {
  addLog('刷新数据', 'green')
  message.success('数据已刷新')
}

function handleAdd() {
  addLog('新增数据', 'blue')
  message.info('打开新增弹窗')
}

function handleImport() {
  addLog('导入数据', 'purple')
  message.info('打开导入对话框')
}

function handleMenuClick({ key }: { key: string }) {
  const logMap: Record<string, { action: string; color: string }> = {
    export: { action: '导出数据', color: 'cyan' },
    config: { action: '列设置', color: 'default' },
  }

  const log = logMap[key]
  if (log) {
    addLog(log.action, log.color)
    message.info('执行: '.concat(log.action))
  }
}

function addLog(action: string, color: string) {
  actionLogs.value.unshift({
    id: Date.now(),
    action,
    time: new Date().toLocaleTimeString(),
    color,
  })
  if (actionLogs.value.length > 8) {
    actionLogs.value.pop()
  }
}
// @core-end

const instructions = [
  '通过 buttons 属性配置工具栏按钮',
  '每个按钮支持 type、icon、danger 等属性',
  '使用 show-refresh 显示刷新按钮',
  '通过 left 和 right 插槽自定义左右侧内容',
  '支持点击事件和刷新事件的独立处理',
]

// 代码字符串
const coreCodeParts = [
  '<template>\n  <!-- 基础用法 -->\n  <Toolbar\n',
  '    :buttons="toolbarButtons"\n',
  '    @click="handleToolbarClick"\n  />\n\n',
  '  <!-- 带刷新按钮 -->\n  <Toolbar\n',
  '    :buttons="toolbarButtons"\n',
  '    :show-refresh="true"\n',
  '    @refresh="handleRefresh"\n  />\n\n',
  '  <!-- 使用插槽 -->\n  <Toolbar>\n',
  '    <template #left>\n',
  '      <a-button type="primary">新增</a-button>\n',
  '    </template>\n    <template #right>\n',
  '      <a-button>更多</a-button>\n',
  '    </template>\n  </Toolbar>\n</template>\n\n',
  '<script setup lang="ts">\n',
  'const toolbarButtons = [\n',
  '  { key: \'add\', label: \'新增\', type: \'primary\', icon: \'PlusOutlined\' },\n',
  '  { key: \'edit\', label: \'编辑\', icon: \'EditOutlined\' },\n',
  '  { key: \'delete\', label: \'删除\', danger: true, icon: \'DeleteOutlined\' },\n',
  ']\n',
]

const coreCode = coreCodeParts.join('')

const code = '<!-- 完整代码略，请查看文件源码 -->'
</script>

<style scoped lang="less">
.toolbar-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-secondary, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
}

.ml-2 {
  margin-left: 8px;
}
</style>
