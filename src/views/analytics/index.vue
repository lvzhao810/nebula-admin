<template>
  <div class="space-y-6">
    <!-- 顶部统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :trend="stat.trend"
        :icon="stat.icon"
        :color="stat.color"
        :prefix="stat.prefix"
      />
    </div>

    <!-- 第一行图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 实时流量趋势 -->
      <div class="lg:col-span-2 bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-text-primary">实时流量趋势</h3>
          <div class="flex items-center gap-2">
            <span class="flex items-center gap-1 text-xs">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span class="text-text-secondary">实时更新</span>
            </span>
          </div>
        </div>
        <div ref="trafficChartRef" class="h-80"></div>
      </div>

      <!-- 用户分布饼图 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">用户分布</h3>
        <div ref="userDistChartRef" class="h-80"></div>
      </div>
    </div>

    <!-- 第二行图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 销售额柱状图 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-text-primary">月度销售额对比</h3>
          <a-select v-model:value="salesPeriod" size="small" style="width: 100px">
            <a-select-option value="week">本周</a-select-option>
            <a-select-option value="month">本月</a-select-option>
            <a-select-option value="year">本年</a-select-option>
          </a-select>
        </div>
        <div ref="salesChartRef" class="h-80"></div>
      </div>

      <!-- 业务指标雷达图 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">业务指标</h3>
        <div ref="radarChartRef" class="h-80"></div>
      </div>
    </div>

    <!-- 第三行图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 系统性能仪表盘 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">CPU 使用率</h3>
        <div ref="cpuChartRef" class="h-48"></div>
        <div class="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-text-primary">{{ cpuUsage }}%</div>
            <div class="text-xs text-text-tertiary">当前使用</div>
          </div>
          <div>
            <div class="text-2xl font-bold" :class="cpuTrend > 0 ? 'text-red-500' : 'text-green-500'">
              {{ cpuTrend > 0 ? '↑' : '↓' }}{{ Math.abs(cpuTrend) }}%
            </div>
            <div class="text-xs text-text-tertiary">较昨日</div>
          </div>
        </div>
      </div>

      <!-- 内存使用仪表盘 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">内存使用</h3>
        <div ref="memoryChartRef" class="h-48"></div>
        <div class="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-text-primary">{{ memoryUsage }}%</div>
            <div class="text-xs text-text-tertiary">当前使用</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-text-secondary">{{ memoryUsed }}GB</div>
            <div class="text-xs text-text-tertiary">已用空间</div>
          </div>
        </div>
      </div>

      <!-- 活跃时段热力图 -->
      <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
        <h3 class="text-base font-semibold text-text-primary mb-4">活跃时段分布</h3>
        <div ref="heatmapChartRef" class="h-64"></div>
      </div>
    </div>

    <!-- 实时数据表格 -->
    <div class="bg-card-bg rounded-lg p-6 shadow-sm card-hover">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-text-primary">实时数据监控</h3>
        <a-button size="small" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          刷新数据
        </a-button>
      </div>
      <a-table
        :columns="tableColumns"
        :data-source="realtimeData"
        :pagination="false"
        size="small"
        :row-key="(record: any) => record.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '正常' ? 'green' : record.status === '警告' ? 'orange' : 'red'">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'trend'">
            <span :class="record.trend > 0 ? 'text-green-500' : 'text-red-500'">
              {{ record.trend > 0 ? '↑' : '↓' }}{{ Math.abs(record.trend) }}%
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { useThemeStore } from '@/stores/theme'
import { themeStyles } from '@/stores/theme'
import StatCard from '@/components/common/StatCard.vue'
import {
  ReloadOutlined,
} from '@ant-design/icons-vue'

const themeStore = useThemeStore()
const salesPeriod = ref('month')

// 图表引用
const trafficChartRef = ref<HTMLDivElement>()
const userDistChartRef = ref<HTMLDivElement>()
const salesChartRef = ref<HTMLDivElement>()
const radarChartRef = ref<HTMLDivElement>()
const cpuChartRef = ref<HTMLDivElement>()
const memoryChartRef = ref<HTMLDivElement>()
const heatmapChartRef = ref<HTMLDivElement>()

// 图表实例
let trafficChart: echarts.ECharts | null = null
let userDistChart: echarts.ECharts | null = null
let salesChart: echarts.ECharts | null = null
let radarChart: echarts.ECharts | null = null
let cpuChart: echarts.ECharts | null = null
let memoryChart: echarts.ECharts | null = null
let heatmapChart: echarts.ECharts | null = null

// 实时更新定时器
let updateTimer: number | null = null

// 统计数据
const stats = ref([
  { title: '总访问量', value: 284759, trend: 12.5, icon: 'UserOutlined', color: 'from-nebula-500 to-nebula-600', prefix: '' },
  { title: '销售额', value: 156782, trend: 8.2, icon: 'DollarOutlined', color: 'from-aura-500 to-aura-600', prefix: '¥' },
  { title: '订单数', value: 3847, trend: -2.4, icon: 'ShoppingCartOutlined', color: 'from-blue-500 to-cyan-500', prefix: '' },
  { title: '转化率', value: 3.28, trend: 5.6, icon: 'RiseOutlined', color: 'from-pink-500 to-rose-500', prefix: '' },
])

// 系统性能数据
const cpuUsage = ref(45)
const memoryUsage = ref(62)
const memoryUsed = ref(9.8)
const cpuTrend = ref(-3.2)

// 实时数据表格
const tableColumns = [
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '响应时间', dataIndex: 'responseTime', key: 'responseTime' },
  { title: '请求数', dataIndex: 'requests', key: 'requests' },
  { title: '错误率', dataIndex: 'errorRate', key: 'errorRate' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '趋势', dataIndex: 'trend', key: 'trend' },
]

const realtimeData = ref([
  { id: 1, name: 'API Gateway', responseTime: '45ms', requests: '12,847', errorRate: '0.12%', status: '正常', trend: 2.3 },
  { id: 2, name: 'User Service', responseTime: '32ms', requests: '8,234', errorRate: '0.08%', status: '正常', trend: -1.2 },
  { id: 3, name: 'Order Service', responseTime: '78ms', requests: '5,671', errorRate: '0.15%', status: '正常', trend: 5.4 },
  { id: 4, name: 'Payment Service', responseTime: '156ms', requests: '3,892', errorRate: '0.21%', status: '警告', trend: 8.7 },
  { id: 5, name: 'Notification', responseTime: '23ms', requests: '15,234', errorRate: '0.05%', status: '正常', trend: -0.8 },
])

// 获取主题颜色
const getThemeColors = computed(() => {
  const colors = themeStyles[themeStore.style]
  const isDark = themeStore.mode === 'dark'
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    isDark,
    text: isDark ? '#f1f5f9' : '#1f2937',
    textSecondary: isDark ? '#94a3b8' : '#6b7280',
    bg: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
  }
})

// 初始化流量趋势图
const initTrafficChart = () => {
  if (!trafficChartRef.value) return
  
  trafficChart = echarts.init(trafficChartRef.value)
  
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      axisLine: { lineStyle: { color: getThemeColors.value.border } },
      axisLabel: { color: getThemeColors.value.textSecondary },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: getThemeColors.value.border, type: 'dashed' } },
      axisLabel: { color: getThemeColors.value.textSecondary },
    },
    series: [{
      name: '访问量',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3, color: getThemeColors.value.primary },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: getThemeColors.value.primary + '40' },
          { offset: 1, color: getThemeColors.value.primary + '05' },
        ]),
      },
      itemStyle: { color: getThemeColors.value.primary },
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 5000) + 2000),
    }],
  }
  
  trafficChart.setOption(option)
}

// 初始化用户分布饼图
const initUserDistChart = () => {
  if (!userDistChartRef.value) return
  
  userDistChart = echarts.init(userDistChartRef.value)
  
  const option = {
    tooltip: { trigger: 'item' },
    legend: { bottom: '0', left: 'center', textStyle: { color: getThemeColors.value.textSecondary } },
    series: [{
      name: '用户分布',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: getThemeColors.value.bg, borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: getThemeColors.value.text } },
      data: [
        { value: 1048, name: '直接访问', itemStyle: { color: getThemeColors.value.primary } },
        { value: 735, name: '搜索引擎', itemStyle: { color: getThemeColors.value.secondary } },
        { value: 580, name: '社交媒体', itemStyle: { color: '#ec4899' } },
        { value: 484, name: '外部链接', itemStyle: { color: '#3b82f6' } },
        { value: 300, name: '其他', itemStyle: { color: '#10b981' } },
      ],
    }],
  }
  
  userDistChart.setOption(option)
}

// 初始化销售额柱状图
const initSalesChart = () => {
  if (!salesChartRef.value) return
  
  salesChart = echarts.init(salesChartRef.value)
  
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: { lineStyle: { color: getThemeColors.value.border } },
      axisLabel: { color: getThemeColors.value.textSecondary },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: getThemeColors.value.border, type: 'dashed' } },
      axisLabel: { color: getThemeColors.value.textSecondary, formatter: '¥{value}' },
    },
    series: [
      {
        name: '去年',
        type: 'bar',
        itemStyle: { color: getThemeColors.value.border },
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1200, 1100, 1350, 1450],
      },
      {
        name: '今年',
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: getThemeColors.value.primary },
            { offset: 1, color: getThemeColors.value.secondary },
          ]),
        },
        data: [920, 1132, 1101, 1234, 1490, 1530, 1620, 1750, 1400, 1300, 1550, 1850],
      },
    ],
  }
  
  salesChart.setOption(option)
}

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChartRef.value) return
  
  radarChart = echarts.init(radarChartRef.value)
  
  const option = {
    tooltip: {},
    radar: {
      indicator: [
        { name: '销售', max: 100 },
        { name: '用户增长', max: 100 },
        { name: '转化率', max: 100 },
        { name: '活跃度', max: 100 },
        { name: '留存率', max: 100 },
      ],
      axisName: { color: getThemeColors.value.textSecondary },
      splitArea: { areaStyle: { color: [getThemeColors.value.bg + '05', getThemeColors.value.bg + '10'] } },
      axisLine: { lineStyle: { color: getThemeColors.value.border } },
      splitLine: { lineStyle: { color: getThemeColors.value.border } },
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [85, 72, 68, 90, 78],
          name: '目标完成',
          areaStyle: { color: getThemeColors.value.primary + '40' },
          lineStyle: { color: getThemeColors.value.primary },
          itemStyle: { color: getThemeColors.value.primary },
        },
        {
          value: [75, 65, 80, 70, 85],
          name: '实际达成',
          areaStyle: { color: getThemeColors.value.secondary + '40' },
          lineStyle: { color: getThemeColors.value.secondary },
          itemStyle: { color: getThemeColors.value.secondary },
        },
      ],
    }],
  }
  
  radarChart.setOption(option)
}

// 初始化CPU仪表盘
const initCpuChart = () => {
  if (!cpuChartRef.value) return
  
  cpuChart = echarts.init(cpuChartRef.value)
  
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      radius: '100%',
      center: ['50%', '70%'],
      axisLine: {
        lineStyle: {
          width: 15,
          color: [
            [0.6, '#10b981'],
            [0.8, '#f59e0b'],
            [1, '#ef4444'],
          ],
        },
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '60%',
        width: 10,
        offsetCenter: [0, '-10%'],
        itemStyle: { color: getThemeColors.value.primary },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        fontSize: 24,
        offsetCenter: [0, '30%'],
        valueAnimation: true,
        formatter: '{value}%',
        color: getThemeColors.value.text,
      },
      data: [{ value: cpuUsage.value }],
    }],
  }
  
  cpuChart.setOption(option)
}

// 初始化内存仪表盘
const initMemoryChart = () => {
  if (!memoryChartRef.value) return
  
  memoryChart = echarts.init(memoryChartRef.value)
  
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      radius: '100%',
      center: ['50%', '70%'],
      axisLine: {
        lineStyle: {
          width: 15,
          color: [
            [0.5, '#10b981'],
            [0.75, '#f59e0b'],
            [1, '#ef4444'],
          ],
        },
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '60%',
        width: 10,
        offsetCenter: [0, '-10%'],
        itemStyle: { color: getThemeColors.value.secondary },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        fontSize: 24,
        offsetCenter: [0, '30%'],
        valueAnimation: true,
        formatter: '{value}%',
        color: getThemeColors.value.text,
      },
      data: [{ value: memoryUsage.value }],
    }],
  }
  
  memoryChart.setOption(option)
}

// 初始化热力图
const initHeatmapChart = () => {
  if (!heatmapChartRef.value) return
  
  heatmapChart = echarts.init(heatmapChartRef.value)
  
  const hours = ['0时', '3时', '6时', '9时', '12时', '15时', '18时', '21时', '24时']
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  
  const data = []
  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < hours.length; j++) {
      data.push([j, i, Math.floor(Math.random() * 100)])
    }
  }
  
  const option = {
    tooltip: { position: 'top' },
    grid: { left: '15%', right: '10%', top: '5%', bottom: '15%' },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLine: { lineStyle: { color: getThemeColors.value.border } },
      axisLabel: { color: getThemeColors.value.textSecondary },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLine: { lineStyle: { color: getThemeColors.value.border } },
      axisLabel: { color: getThemeColors.value.textSecondary },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      inRange: {
        color: [getThemeColors.value.primary + '20', getThemeColors.value.primary + '80', getThemeColors.value.primary],
      },
    },
    series: [{
      type: 'heatmap',
      data: data,
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
      },
    }],
  }
  
  heatmapChart.setOption(option)
}

// 更新所有图表
const updateCharts = () => {
  // 更新流量图数据
  if (trafficChart) {
    const newData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 5000) + 2000)
    trafficChart.setOption({
      series: [{ data: newData }],
    })
  }
  
  // 更新统计数据
  stats.value = stats.value.map(stat => ({
    ...stat,
    value: stat.value + Math.floor(Math.random() * 100) - 50,
    trend: stat.trend + (Math.random() - 0.5) * 2,
  }))
  
  // 更新系统性能
  cpuUsage.value = Math.min(100, Math.max(0, cpuUsage.value + Math.floor(Math.random() * 10) - 5))
  memoryUsage.value = Math.min(100, Math.max(0, memoryUsage.value + Math.floor(Math.random() * 6) - 3))
  memoryUsed.value = Math.round((memoryUsage.value / 100) * 16 * 10) / 10
  cpuTrend.value = Math.round((Math.random() - 0.5) * 10 * 10) / 10
  
  // 更新仪表盘
  if (cpuChart) {
    cpuChart.setOption({ series: [{ data: [{ value: cpuUsage.value }] }] })
  }
  if (memoryChart) {
    memoryChart.setOption({ series: [{ data: [{ value: memoryUsage.value }] }] })
  }
  
  // 更新表格数据
  realtimeData.value = realtimeData.value.map(item => ({
    ...item,
    responseTime: `${Math.floor(Math.random() * 100) + 20}ms`,
    requests: Math.floor(Math.random() * 10000).toLocaleString(),
    trend: Math.round((Math.random() - 0.5) * 20 * 10) / 10,
  }))
}

// 刷新数据
const refreshData = () => {
  updateCharts()
}

// 响应窗口大小变化
const handleResize = () => {
  trafficChart?.resize()
  userDistChart?.resize()
  salesChart?.resize()
  radarChart?.resize()
  cpuChart?.resize()
  memoryChart?.resize()
  heatmapChart?.resize()
}

// 监听主题变化
watch(() => themeStore.currentTheme, () => {
  // 重新初始化所有图表以应用新主题
  setTimeout(() => {
    initTrafficChart()
    initUserDistChart()
    initSalesChart()
    initRadarChart()
    initCpuChart()
    initMemoryChart()
    initHeatmapChart()
  }, 100)
})

onMounted(() => {
  initTrafficChart()
  initUserDistChart()
  initSalesChart()
  initRadarChart()
  initCpuChart()
  initMemoryChart()
  initHeatmapChart()
  
  // 启动实时更新
  updateTimer = window.setInterval(updateCharts, 3000)
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (updateTimer) clearInterval(updateTimer)
  window.removeEventListener('resize', handleResize)
  
  trafficChart?.dispose()
  userDistChart?.dispose()
  salesChart?.dispose()
  radarChart?.dispose()
  cpuChart?.dispose()
  memoryChart?.dispose()
  heatmapChart?.dispose()
})
</script>

<style scoped>
.card-hover {
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
  border: 1px solid var(--border-color);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
</style>
