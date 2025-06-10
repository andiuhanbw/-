<template>
  <div class="product-ranking-table">
    <div class="table-header">
      <h4>商品销售排行榜</h4>
      <el-button 
        type="primary" 
        size="small" 
        @click="exportRanking"
        :loading="exporting"
      >
        导出报告
      </el-button>
    </div>
    
    <el-table
      :data="data"
      :loading="loading"
      stripe
      style="width: 100%"
    >
      <el-table-column
        label="排名"
        width="80"
        align="center"
      >
        <template #default="{ $index }">
          <div class="ranking-badge" :class="getRankingClass($index)">
            {{ $index + 1 }}
          </div>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="name"
        label="商品名称"
        min-width="200"
      >
        <template #default="{ row }">
          <div class="product-info">
            <div class="product-name">{{ row.name }}</div>
            <div class="product-id">ID: {{ row.id }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="sales"
        label="销售数量"
        width="120"
        sortable
        align="right"
      >
        <template #default="{ row }">
          <span class="sales-count">{{ row.sales.toLocaleString() }}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="revenue"
        label="销售额"
        width="140"
        sortable
        align="right"
      >
        <template #default="{ row }">
          <span class="revenue-amount">¥{{ row.revenue.toLocaleString() }}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        label="市场占比"
        width="120"
        align="center"
      >
        <template #default="{ row }">
          <el-progress
            :percentage="getMarketShare(row)"
            :stroke-width="8"
            :show-text="false"
            :color="getProgressColor(getMarketShare(row))"
          />
          <span class="percentage-text">{{ getMarketShare(row) }}%</span>
        </template>
      </el-table-column>
      
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template #default="{ row }">
          <el-button
            type="text"
            size="small"
            @click="viewDetails(row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const exporting = ref(false)

// 计算总销售额用于市场占比计算
const totalRevenue = computed(() => {
  return props.data.reduce((total, item) => total + item.revenue, 0)
})

// 获取排名样式类
const getRankingClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return 'normal'
}

// 计算市场占比
const getMarketShare = (row) => {
  if (totalRevenue.value === 0) return 0
  return Math.round((row.revenue / totalRevenue.value) * 100)
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage >= 20) return '#67C23A'
  if (percentage >= 10) return '#E6A23C'
  return '#409EFF'
}

// 查看商品详情
const viewDetails = (row) => {
  ElMessage.info(`查看商品详情: ${row.name}`)
  // 这里可以跳转到商品详情页面或打开详情弹窗
}

// 导出排行榜报告
const exportRanking = async () => {
  exporting.value = true
  try {
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('排行榜报告导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}
</script>

<style scoped>
.product-ranking-table {
  padding: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.ranking-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  margin: 0 auto;
}

.ranking-badge.gold {
  background: linear-gradient(45deg, #FFD700, #FFA500);
}

.ranking-badge.silver {
  background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
}

.ranking-badge.bronze {
  background: linear-gradient(45deg, #CD7F32, #B87333);
}

.ranking-badge.normal {
  background: linear-gradient(45deg, #909399, #767A82);
}

.product-info {
  padding: 5px 0;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.product-id {
  font-size: 12px;
  color: #999;
}

.sales-count {
  font-weight: 600;
  color: #67C23A;
}

.revenue-amount {
  font-weight: 600;
  color: #409EFF;
}

.percentage-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  display: block;
}

:deep(.el-progress-bar__outer) {
  background-color: #f0f0f0;
}
</style>
