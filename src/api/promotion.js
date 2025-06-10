import request from './index'

// Mock 数据
const mockPromotions = [
  {
    id: 1,
    name: '双十一狂欢节',
    type: '满减',
    description: '全场满1000减100',
    startTime: '2024-11-01 00:00:00',
    endTime: '2024-11-11 23:59:59',
    status: '进行中',
    discountType: 'amount',
    discountValue: 100,
    minAmount: 1000,
    maxDiscount: 500,
    usageLimit: 1000,
    usedCount: 234,
    applicableProducts: ['iPhone 15', 'Samsung S24'],
    createdAt: '2024-10-15 10:30:00',
    updatedAt: '2024-10-15 10:30:00'
  },
  {
    id: 2,
    name: '新用户专享',
    type: '折扣',
    description: '新用户首单8折',
    startTime: '2024-01-01 00:00:00',
    endTime: '2024-12-31 23:59:59',
    status: '进行中',
    discountType: 'percent',
    discountValue: 20,
    minAmount: 0,
    maxDiscount: 200,
    usageLimit: 10000,
    usedCount: 1567,
    applicableProducts: ['全部商品'],
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00'
  },
  {
    id: 3,
    name: '中秋节特惠',
    type: '买赠',
    description: '买二送一活动',
    startTime: '2024-09-15 00:00:00',
    endTime: '2024-09-17 23:59:59',
    status: '已过期',
    discountType: 'gift',
    discountValue: 0,
    minAmount: 0,
    maxDiscount: 0,
    usageLimit: 500,
    usedCount: 456,
    applicableProducts: ['小米手机', 'OPPO手机'],
    createdAt: '2024-09-01 00:00:00',
    updatedAt: '2024-09-01 00:00:00'
  }
]

// 获取促销活动列表
export const getPromotions = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredPromotions = [...mockPromotions]
      
      // 模拟搜索
      if (params.keyword) {
        filteredPromotions = filteredPromotions.filter(p => 
          p.name.includes(params.keyword) || 
          p.description.includes(params.keyword)
        )
      }
      
      // 模拟状态筛选
      if (params.status) {
        filteredPromotions = filteredPromotions.filter(p => p.status === params.status)
      }
      
      resolve({
        code: 200,
        data: filteredPromotions,
        total: filteredPromotions.length
      })
    }, 300)
  })
}

// 创建促销活动
export const createPromotion = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPromotion = {
        ...data,
        id: Date.now(),
        usedCount: 0,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      }
      mockPromotions.unshift(newPromotion)
      resolve({
        code: 200,
        data: newPromotion,
        message: '创建成功'
      })
    }, 300)
  })
}

// 更新促销活动
export const updatePromotion = (id, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockPromotions.findIndex(p => p.id === id)
      if (index !== -1) {
        mockPromotions[index] = {
          ...mockPromotions[index],
          ...data,
          updatedAt: new Date().toLocaleString()
        }
        resolve({
          code: 200,
          data: mockPromotions[index],
          message: '更新成功'
        })
      }
    }, 300)
  })
}

// 删除促销活动
export const deletePromotion = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockPromotions.findIndex(p => p.id === id)
      if (index !== -1) {
        mockPromotions.splice(index, 1)
      }
      resolve({
        code: 200,
        message: '删除成功'
      })
    }, 300)
  })
}

// 获取促销活动详情
export const getPromotionDetail = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const promotion = mockPromotions.find(p => p.id === id)
      resolve({
        code: 200,
        data: promotion
      })
    }, 300)
  })
}
