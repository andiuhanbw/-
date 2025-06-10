<template>
  <div class="statistics-view">
    <div class="page-header">
      <h2>数据统计</h2>
      <div class="date-range-picker">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateRangeChange"
        />
        <el-button type="primary" @click="refreshData">刷新数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon sales">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ formatNumber(totalSales) }}</div>
              <div class="stat-label">总销售额</div>
              <div class="stat-trend positive">+12.5%</div>
            </div>
          </div>
        </el-col>
        
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon orders">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(totalOrders) }}</div>
              <div class="stat-label">总订单数</div>
              <div class="stat-trend positive">+8.3%</div>
            </div>
          </div>
        </el-col>
        
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatNumber(userStats.totalUsers) }}</div>
              <div class="stat-label">总用户数</div>
              <div class="stat-trend positive">+15.2%</div>
            </div>
          </div>
        </el-col>
        
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon average">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">¥{{ formatNumber(averageOrderValue) }}</div>
              <div class="stat-label">平均订单额</div>
              <div class="stat-trend negative">-2.1%</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <ChartComponents 
        :sales-data="salesData"
        :order-stats="orderStats"
        :product-stats="productStats"
      />
    </div>

    <!-- 详细统计表格 -->
    <div class="detailed-stats">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="销售明细" name="sales">
          <SalesDetailTable :data="salesData" :loading="loading" />
        </el-tab-pane>
        
        <el-tab-pane label="用户分析" name="users">
          <UserAnalysisTable :data="userStats" :loading="loading" />
        </el-tab-pane>
        
        <el-tab-pane label="商品排行" name="products">
          <ProductRankingTable :data="productStats" :loading="loading" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStatisticsStore } from '@/stores/statistics'
import ChartComponents from '@/components/ChartComponents.vue'
import SalesDetailTable from '@/components/SalesDetailTable.vue'
import UserAnalysisTable from '@/components/UserAnalysisTable.vue'
import ProductRankingTable from '@/components/ProductRankingTable.vue'

const statisticsStore = useStatisticsStore()

// 响应式数据
const dateRange = ref([
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
])
const activeTab = ref('sales')

// 计算属性
const salesData = computed(() => statisticsStore.salesData)
const userStats = computed(() => statisticsStore.userStats)
const orderStats = computed(() => statisticsStore.orderStats)
const productStats = computed(() => statisticsStore.productStats)
const loading = computed(() => statisticsStore.loading)
const totalSales = computed(() => statisticsStore.totalSales)
const totalOrders = computed(() => statisticsStore.totalOrders)
const averageOrderValue = computed(() => statisticsStore.averageOrderValue)

// 格式化数字
const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}

// 处理日期范围变化
const handleDateRangeChange = (dates) => {
  if (dates && dates.length === 2) {
    loadStatisticsData()
  }
}

// 刷新数据
const refreshData = () => {
  loadStatisticsData()
}

// 加载统计数据
const loadStatisticsData = async () => {
  try {
    const dateRangeParam = {
      startDate: dateRange.value[0]?.toISOString().split('T')[0],
      endDate: dateRange.value[1]?.toISOString().split('T')[0]
    }
    
    await Promise.all([
      statisticsStore.fetchSalesStats(dateRangeParam),
      statisticsStore.fetchUserStats(),
      statisticsStore.fetchOrderStats(dateRangeParam),
      statisticsStore.fetchProductRanking(10)
    ])
    
    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('数据加载失败')
  }
}

onMounted(() => {
  loadStatisticsData()
})
</script>

<style scoped>
.statistics-view {
  padding: 20px;
  background: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 500;
}

.date-range-picker {
  display: flex;
  gap: 10px;
  align-items: center;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.sales {
  background: linear-gradient(45deg, #409EFF, #67C23A);
}

.stat-icon.orders {
  background: linear-gradient(45deg, #E6A23C, #F56C6C);
}

.stat-icon.users {
  background: linear-gradient(45deg, #909399, #409EFF);
}

.stat-icon.average {
  background: linear-gradient(45deg, #67C23A, #E6A23C);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-trend {
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.positive {
  color: #67C23A;
}

.stat-trend.negative {
  color: #F56C6C;
}

.charts-section {
  margin-bottom: 20px;
}

.detailed-stats {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

:deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
}
</style>
