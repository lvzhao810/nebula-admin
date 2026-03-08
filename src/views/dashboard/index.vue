<template>
  <div class="space-y-6">
    <!-- 欢迎语 -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-text-primary">欢迎回来，{{ userStore.userInfo?.nickname || '管理员' }}！</h1>
        <p class="text-text-secondary text-sm mt-1">今天是 {{ currentDate }}，祝你工作愉快！</p>
      </div>
      <a-button type="primary" class="!bg-gradient-nebula !border-0 rounded-md">
        <template #icon><PlusOutlined /></template>
        快捷操作
      </a-button>
    </div>

    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="总用户数"
        :value="12847"
        :trend="12.5"
        icon="UserOutlined"
        color="from-nebula-500 to-nebula-600"
      />
      <StatCard
        title="今日访问"
        :value="3248"
        :trend="8.2"
        icon="EyeOutlined"
        color="from-aura-500 to-aura-600"
      />
      <StatCard
        title="订单数量"
        :value="892"
        :trend="-2.4"
        icon="ShoppingCartOutlined"
        color="from-blue-500 to-cyan-500"
      />
      <StatCard
        title="总收入"
        :value="45682"
        :trend="15.8"
        prefix="¥"
        icon="DollarOutlined"
        color="from-pink-500 to-rose-500"
      />
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 访问趋势图 -->
      <div class="lg:col-span-2 bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-text-primary">访问趋势</h3>
          <a-radio-group v-model:value="trendPeriod" size="small" button-style="solid">
            <a-radio-button value="week">周</a-radio-button>
            <a-radio-button value="month">月</a-radio-button>
            <a-radio-button value="year">年</a-radio-button>
          </a-radio-group>
        </div>
        <div ref="trendChartRef" class="h-80"></div>
      </div>

      <!-- 访问来源饼图 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">访问来源</h3>
        <div ref="sourceChartRef" class="h-80"></div>
      </div>
    </div>

    <!-- 下方数据 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热门页面 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">热门页面</h3>
        <div class="space-y-3">
          <div v-for="(page, index) in hotPages" :key="index" class="flex items-center">
            <div
              class="w-8 h-8 rounded-md flex items-center justify-center mr-3 text-sm font-bold flex-shrink-0"
              :class="index < 3 ? 'bg-gradient-nebula text-white' : 'bg-bg-tertiary text-text-secondary'"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-text-primary font-medium truncate">{{ page.name }}</div>
              <div class="text-text-tertiary text-xs truncate">{{ page.path }}</div>
            </div>
            <div class="page-views font-medium flex-shrink-0">{{ page.views }}</div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">最近活动</h3>
        <a-timeline>
          <a-timeline-item v-for="item in activities" :key="item.id" :color="item.color">
            <div class="flex items-start">
              <div class="flex-1">
                <div class="text-text-primary">{{ item.title }}</div>
                <div class="text-text-tertiary text-xs mt-1">{{ item.time }}</div>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import StatCard from '@/components/common/StatCard.vue'
import {
  PlusOutlined,
  UserOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons-vue'

const userStore = useUserStore()

const currentDate = dayjs().format('YYYY年MM月DD日')
const trendPeriod = ref('week')
const trendChartRef = ref<HTMLDivElement>()
const sourceChartRef = ref<HTMLDivElement>()

let trendChart: echarts.ECharts | null = null
let sourceChart: echarts.ECharts | null = null

// 热门页面数据
const hotPages = [
  { name: '数据概览', path: '/dashboard', views: '12,458' },
  { name: '用户管理', path: '/system/user', views: '8,234' },
  { name: '角色管理', path: '/system/role', views: '5,678' },
  { name: '菜单管理', path: '/system/menu', views: '4,321' },
  { name: '个人中心', path: '/profile', views: '2,456' },
]

// 最近活动数据
const activities = [
  { id: 1, title: '用户 张三 更新了个人资料', time: '5 分钟前', color: 'blue' },
  { id: 2, title: '系统执行了定时任务', time: '15 分钟前', color: 'green' },
  { id: 3, title: '新用户 李四 注册成功', time: '30 分钟前', color: 'purple' },
  { id: 4, title: '角色权限配置已更新', time: '1 小时前', color: 'orange' },
  { id: 5, title: '系统版本升级至 v2.0.1', time: '2 小时前', color: 'red' },
]

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#374151',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#6366f1' },
              { offset: 1, color: '#8b5cf6' },
            ],
          },
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0)' },
            ],
          },
        },
        itemStyle: {
          color: '#6366f1',
          borderWidth: 2,
          borderColor: '#fff',
        },
        data: [820, 932, 901, 1234, 1290, 1330, 1320],
      },
    ],
  }

  trendChart.setOption(option)
}

// 初始化来源图
const initSourceChart = () => {
  if (!sourceChartRef.value) return

  sourceChart = echarts.init(sourceChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#374151',
      },
    },
    legend: {
      bottom: '0',
      left: 'center',
      icon: 'circle',
      textStyle: {
        color: '#6b7280',
      },
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#374151',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '直接访问', itemStyle: { color: '#6366f1' } },
          { value: 735, name: '搜索引擎', itemStyle: { color: '#8b5cf6' } },
          { value: 580, name: '社交媒体', itemStyle: { color: '#ec4899' } },
          { value: 484, name: '外部链接', itemStyle: { color: '#3b82f6' } },
          { value: 300, name: '其他', itemStyle: { color: '#10b981' } },
        ],
      },
    ],
  }

  sourceChart.setOption(option)
}

onMounted(() => {
  initTrendChart()
  initSourceChart()

  // 响应式处理
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  sourceChart?.dispose()
})

const handleResize = () => {
  trendChart?.resize()
  sourceChart?.resize()
}
</script>

<style scoped>
/* 页面浏览次数颜色 - 使用主题色 */
.page-views {
  color: var(--theme-primary);
}
</style>
