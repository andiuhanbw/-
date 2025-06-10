// src/api/statistics.js
import request from '@/utils/request'

// 获取销售统计数据
export function getSalesStatistics(params) {
  return request({
    url: '/api/statistics/sales',
    method: 'get',
    params
  })
}

// 获取用户统计数据
export function getUserStatistics(params) {
  return request({
    url: '/api/statistics/users',
    method: 'get',
    params
  })
}

// 获取订单统计数据
export function getOrderStatistics(params) {
  return request({
    url: '/api/statistics/orders',
    method: 'get',
    params
  })
}

// 获取收入统计数据
export function getRevenueStatistics(params) {
  return request({
    url: '/api/statistics/revenue',
    method: 'get',
    params
  })
}

// 获取产品统计数据
export function getProductStatistics(params) {
  return request({
    url: '/api/statistics/products',
    method: 'get',
    params
  })
}

// 获取访问统计数据
export function getVisitStatistics(params) {
  return request({
    url: '/api/statistics/visits',
    method: 'get',
    params
  })
}
