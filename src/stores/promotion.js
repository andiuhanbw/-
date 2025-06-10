import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as promotionApi from '@/api/promotion'

export const usePromotionStore = defineStore('promotion', () => {
  // 状态
  const promotions = ref([])
  const loading = ref(false)
  const currentPromotion = ref(null)

  // 计算属性
  const activePromotions = computed(() => {
    return promotions.value.filter(promotion => promotion.status === '进行中')
  })

  const expiredPromotions = computed(() => {
    return promotions.value.filter(promotion => promotion.status === '已过期')
  })

  // 获取促销活动列表
  const fetchPromotions = async (params = {}) => {
    loading.value = true
    try {
      const response = await promotionApi.getPromotions(params)
      promotions.value = response.data
      return response
    } catch (error) {
      console.error('获取促销活动失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建促销活动
  const createPromotion = async (promotionData) => {
    try {
      const response = await promotionApi.createPromotion(promotionData)
      promotions.value.unshift(response.data)
      return response
    } catch (error) {
      console.error('创建促销活动失败:', error)
      throw error
    }
  }

  // 更新促销活动
  const updatePromotion = async (id, promotionData) => {
    try {
      const response = await promotionApi.updatePromotion(id, promotionData)
      const index = promotions.value.findIndex(p => p.id === id)
      if (index !== -1) {
        promotions.value[index] = response.data
      }
      return response
    } catch (error) {
      console.error('更新促销活动失败:', error)
      throw error
    }
  }

  // 删除促销活动
  const deletePromotion = async (id) => {
    try {
      await promotionApi.deletePromotion(id)
      const index = promotions.value.findIndex(p => p.id === id)
      if (index !== -1) {
        promotions.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除促销活动失败:', error)
      throw error
    }
  }

  // 设置当前促销活动
  const setCurrentPromotion = (promotion) => {
    currentPromotion.value = promotion
  }

  return {
    promotions,
    loading,
    currentPromotion,
    activePromotions,
    expiredPromotions,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    setCurrentPromotion
  }
})
