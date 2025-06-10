// src/api/ticket.js
import request from '@/utils/request'

// 获取工单列表
export function getTicketList(params) {
  return request({
    url: '/api/ticket',
    method: 'get',
    params
  })
}

// 创建工单
export function createTicket(data) {
  return request({
    url: '/api/ticket',
    method: 'post',
    data
  })
}

// 更新工单
export function updateTicket(id, data) {
  return request({
    url: `/api/ticket/${id}`,
    method: 'put',
    data
  })
}

// 删除工单
export function deleteTicket(id) {
  return request({
    url: `/api/ticket/${id}`,
    method: 'delete'
  })
}

// 获取工单详情
export function getTicketDetail(id) {
  return request({
    url: `/api/ticket/${id}`,
    method: 'get'
  })
}

// 工单回复
export function replyTicket(id, data) {
  return request({
    url: `/api/ticket/${id}/reply`,
    method: 'post',
    data
  })
}

// 关闭工单
export function closeTicket(id) {
  return request({
    url: `/api/ticket/${id}/close`,
    method: 'put'
  })
}

// 分配工单
export function assignTicket(id, data) {
  return request({
    url: `/api/ticket/${id}/assign`,
    method: 'put',
    data
  })
}

// 获取工单状态统计
export function getTicketStatusStats() {
  return request({
    url: '/api/ticket/stats/status',
    method: 'get'
  })
}
