import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as statisticsApi from '@/api/statistics'

export const useStatisticsStore = defineStore('statistics', () => {
  // 状态数据
  const salesData = ref([])
  const userStats = ref({})
  const orderStats = ref({})
  const productStats = ref([])
  const loading = ref(false)
  
  // 销售趋势数据
  const salesTrend = ref([])
  
  // 计算属性
  const totalSales = computed(() => {
    return salesData.value.reduce((total, item) => total + item.amount, 0)
  })
  
  const totalOrders = computed(() => {
    return orderStats.value.totalOrders || 0
  })
  
  const averageOrderValue = computed(() => {
    return totalOrders.value > 0 ? totalSales.value / totalOrders.value : 0
  })

  // 获取销售统计数据
  const fetchSalesStats = async (dateRange) => {
    loading.value = true
    try {
      const response = await statisticsApi.getSalesStats(dateRange)
      salesData.value = response.data
      return response
    } catch (error) {
      console.error('获取销售统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取用户统计数据
  const fetchUserStats = async () => {
    loading.value = true
    try {
      const response = await statisticsApi.getUserStats()
      userStats.value = response.data
      return response
    } catch (error) {
      console.error('获取用户统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取订单统计数据
  const fetchOrderStats = async (dateRange) => {
    loading.value = true
    try {
      const response = await statisticsApi.getOrderStats(dateRange)
      orderStats.value = response.data
      return response
    } catch (error) {
      console.error('获取订单统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取商品销售排行
  const fetchProductRanking = async (limit = 10) => {
    loading.value = true
    try {
      const response = await statisticsApi.getProductRanking(limit)
      productStats.value = response.data
      return response
    } catch (error) {
      console.error('获取商品排行失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取销售趋势
  const fetchSalesTrend = async (dateRange) => {
    loading.value = true
    try {
      const response = await statisticsApi.getSalesTrend(dateRange)
      salesTrend.value = response.data
      return response
    } catch (error) {
      console.error('获取销售趋势失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    salesData,
    userStats,
    orderStats,
    productStats,
    salesTrend,
    loading,
    
    // 计算属性
    totalSales,
    totalOrders,
    averageOrderValue,
    
    // 方法
    fetchSalesStats,
    fetchUserStats,
    fetchOrderStats,
    fetchProductRanking,
    fetchSalesTrend
  }
})
