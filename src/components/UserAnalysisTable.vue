<template>
  <div class="user-analysis-table">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="analysis-card">
          <h4>用户概览</h4>
          <div class="user-stats">
            <div class="stat-item">
              <span class="label">总用户数:</span>
              <span class="value">{{ data.totalUsers?.toLocaleString() || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">新增用户:</span>
              <span class="value new-users">{{ data.newUsers?.toLocaleString() || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">活跃用户:</span>
              <span class="value active-users">{{ data.activeUsers?.toLocaleString() || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">用户增长率:</span>
              <span class="value growth-rate">{{ data.userGrowthRate || 0 }}%</span>
            </div>
          </div>
        </div>
      </el-col>
      
      <el-col :span="12">
        <div class="analysis-card">
          <h4>用户行为</h4>
          <div class="user-stats">
            <div class="stat-item">
              <span class="label">留存率:</span>
              <span class="value">{{ data.retentionRate || 0 }}%</span>
            </div>
            <div class="stat-item">
              <span class="label">平均会话时长:</span>
              <span class="value">{{ data.averageSessionTime || 0 }} 分钟</span>
            </div>
            <div class="stat-item">
              <span class="label">活跃度:</span>
              <span class="value">{{ calculateActivityRate() }}%</span>
            </div>
            <div class="stat-item">
              <span class="label">转化率:</span>
              <span class="value">{{ calculateConversionRate() }}%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 用户分布图表 -->
    <div class="user-distribution-chart">
      <h4>用户分布趋势</h4>
      <div ref="userChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const userChartRef = ref()
let userChart = null

const calculateActivityRate = () => {
  if (!props.data.totalUsers || !props.data.activeUsers) return 0
  return ((props.data.activeUsers / props.data.totalUsers) * 100).toFixed(1)
}

const calculateConversionRate = () => {
  // 模拟转化率计算
  return (Math.random() * 10 + 2).toFixed(1)
}

const initUserChart = () => {
  if (!userChartRef.value) return
  
  userChart = echarts.init(userChartRef.value)
  
  const option = {
    title: {
      text: '用户活跃度趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增用户', '活跃用户', '留存用户'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      name: '用户数'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '活跃用户',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '留存用户',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410],
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
  
  userChart.setOption(option)
}

onMounted(() => {
  initUserChart()
  
  window.addEventListener('resize', () => {
    userChart?.resize()
  })
})
</script>

<style scoped>
.user-analysis-table {
  padding: 0;
}

.analysis-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
}

.analysis-card h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.user-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 14px;
}

.value {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.new-users {
  color: #67C23A;
}

.active-users {
  color: #409EFF;
}

.growth-rate {
  color: #E6A23C;
}

.user-distribution-chart {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.user-distribution-chart h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
