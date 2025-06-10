import { defineStore } from 'pinia'
import { 
  getTicketList, 
  getTicketDetail, 
  createTicket, 
  updateTicket, 
  deleteTicket,
  replyTicket,
  closeTicket,
  getTicketStatistics
} from '@/api/ticket'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    ticketList: [],
    currentTicket: null,
    loading: false,
    total: 0,
    statistics: {
      total: 0,
      pending: 0,
      processing: 0,
      resolved: 0,
      closed: 0
    }
  }),

  getters: {
    // 获取不同状态的工单数量
    getTicketCountByStatus: (state) => (status) => {
      return state.ticketList.filter(ticket => ticket.status === status).length
    },
    
    // 获取高优先级工单
    getHighPriorityTickets: (state) => {
      return state.ticketList.filter(ticket => ticket.priority === 'high')
    }
  },

  actions: {
    // 获取工单列表
    async fetchTicketList(params = {}) {
      this.loading = true
      try {
        const response = await getTicketList(params)
        this.ticketList = response.data.list
        this.total = response.data.total
        return response
      } catch (error) {
        console.error('获取工单列表失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取工单详情
    async fetchTicketDetail(id) {
      this.loading = true
      try {
        const response = await getTicketDetail(id)
        this.currentTicket = response.data
        return response
      } catch (error) {
        console.error('获取工单详情失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 创建工单
    async createNewTicket(ticketData) {
      try {
        const response = await createTicket(ticketData)
        this.ticketList.unshift(response.data)
        this.total += 1
        return response
      } catch (error) {
        console.error('创建工单失败:', error)
        throw error
      }
    },

    // 更新工单
    async updateTicketInfo(id, ticketData) {
      try {
        const response = await updateTicket(id, ticketData)
        const index = this.ticketList.findIndex(ticket => ticket.id === id)
        if (index !== -1) {
          this.ticketList[index] = response.data
        }
        return response
      } catch (error) {
        console.error('更新工单失败:', error)
        throw error
      }
    },

    // 删除工单
    async removeTicket(id) {
      try {
        await deleteTicket(id)
        this.ticketList = this.ticketList.filter(ticket => ticket.id !== id)
        this.total -= 1
      } catch (error) {
        console.error('删除工单失败:', error)
        throw error
      }
    },

    // 回复工单
    async replyToTicket(id, replyData) {
      try {
        const response = await replyTicket(id, replyData)
        const index = this.ticketList.findIndex(ticket => ticket.id === id)
        if (index !== -1) {
          this.ticketList[index] = response.data
        }
        return response
      } catch (error) {
        console.error('回复工单失败:', error)
        throw error
      }
    },

    // 关闭工单
    async closeTicketById(id) {
      try {
        const response = await closeTicket(id)
        const index = this.ticketList.findIndex(ticket => ticket.id === id)
        if (index !== -1) {
          this.ticketList[index].status = 'closed'
        }
        return response
      } catch (error) {
        console.error('关闭工单失败:', error)
        throw error
      }
    },

    // 获取统计数据
    async fetchStatistics() {
      try {
        const response = await getTicketStatistics()
        this.statistics = response.data
        return response
      } catch (error) {
        console.error('获取统计数据失败:', error)
        throw error
      }
    }
  }
})
