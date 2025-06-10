<template>
  <div class="chart-components">
    <!-- 销售趋势图 -->
    <div class="chart-container">
      <h3>销售趋势图</h3>
      <div ref="salesChartRef" class="chart"></div>
    </div>
    
    <!-- 订单状态饼图 -->
    <div class="chart-container">
      <h3>订单状态分布</h3>
      <div ref="orderChartRef" class="chart"></div>
    </div>
    
    <!-- 商品销售排行 -->
    <div class="chart-container">
      <h3>商品销售排行</h3>
      <div ref="productChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  salesData: {
    type: Array,
    default: () => []
  },
  orderStats: {
    type: Object,
    default: () => ({})
  },
  productStats: {
    type: Array,
    default: () => []
  }
})

const salesChartRef = ref()
const orderChartRef = ref()
const productChartRef = ref()

let salesChart = null
let orderChart = null
let productChart = null

// 初始化销售趋势图
const initSalesChart = () => {
  if (!salesChartRef.value) return
  
  salesChart = echarts.init(salesChartRef.value)
  
  const option = {
    title: {
      text: '销售趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: props.salesData.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      name: '销售额(元)'
    },
    series: [{
      name: '销售额',
      type: 'line',
      data: props.salesData.map(item => item.amount),
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      }
    }]
  }
  
  salesChart.setOption(option)
}

// 初始化订单状态饼图
const initOrderChart = () => {
  if (!orderChartRef.value) return
  
  orderChart = echarts.init(orderChartRef.value)
  
  const data = [
    { value: props.orderStats.pendingOrders || 0, name: '待处理' },
    { value: props.orderStats.shippedOrders || 0, name: '已发货' },
    { value: props.orderStats.completedOrders || 0, name: '已完成' },
    { value: props.orderStats.cancelledOrders || 0, name: '已取消' }
  ]
  
  const option = {
    title: {
      text: '订单状态分布'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      name: '订单数量',
      type: 'pie',
      radius: '50%',
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  orderChart.setOption(option)
}

// 初始化商品排行柱状图
const initProductChart = () => {
  if (!productChartRef.value) return
  
  productChart = echarts.init(productChartRef.value)
  
  const option = {
    title: {
      text: '商品销售排行'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: props.productStats.map(item => item.name),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '销售量'
    },
    series: [{
      name: '销售量',
      type: 'bar',
      data: props.productStats.map(item => item.sales),
      itemStyle: {
        color: '#67C23A'
      }
    }]
  }
  
  productChart.setOption(option)
}

// 监听数据变化，重新渲染图表
watch(() => props.salesData, () => {
  initSalesChart()
}, { deep: true })

watch(() => props.orderStats, () => {
  initOrderChart()
}, { deep: true })

watch(() => props.productStats, () => {
  initProductChart()
}, { deep: true })

onMounted(() => {
  initSalesChart()
  initOrderChart()
  initProductChart()
  
  // 监听窗口变化，重新调整图表大小
  window.addEventListener('resize', () => {
    salesChart?.resize()
    orderChart?.resize()
    productChart?.resize()
  })
})
</script>

<style scoped>
.chart-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  padding: 20px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-container h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
