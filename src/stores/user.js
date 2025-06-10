import { defineStore } from 'pinia'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户数据
    users: [],
    currentUser: null,
    
    // 加载状态
    loading: false,
    
    // 分页信息
    pagination: {
      currentPage: 1,
      pageSize: 10,
      total: 0
    },
    
    // 错误信息
    error: null
  }),

  getters: {
    // 获取特定用户
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id)
    },
    
    // 活跃用户列表
    activeUsers: (state) => {
      return state.users.filter(user => user.status === 'active')
    },
    
    // 总页数
    totalPages: (state) => {
      return Math.ceil(state.pagination.total / state.pagination.pageSize)
    }
  },

  actions: {
    // 获取用户列表
    async fetchUsers(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await userApi.getUsers({
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...params
        })
        
        this.users = response.data.list
        this.pagination.total = response.data.total
        return response.data
        
      } catch (error) {
        this.error = error.message || '获取用户列表失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取单个用户
    async fetchUserById(id) {
      this.loading = true
      try {
        const response = await userApi.getUserById(id)
        this.currentUser = response.data
        
        // 同步更新到用户列表
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.message || '获取用户详情失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 创建用户
    async createUser(userData) {
      try {
        const response = await userApi.createUser(userData)
        this.users.unshift(response.data)
        this.pagination.total += 1
        return response.data
      } catch (error) {
        this.error = error.message || '创建用户失败'
        throw error
      }
    },
    
    // 更新用户
    async updateUser(id, userData) {
      try {
        const response = await userApi.updateUser(id, userData)
        
        // 更新列表中的用户
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = response.data
        }
        
        // 更新当前用户
        if (this.currentUser?.id === id) {
          this.currentUser = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.message || '更新用户失败'
        throw error
      }
    },
    
    // 删除用户
    async deleteUser(id) {
      try {
        await userApi.deleteUser(id)
        this.users = this.users.filter(user => user.id !== id)
        this.pagination.total -= 1
        
        // 清除当前用户
        if (this.currentUser?.id === id) {
          this.currentUser = null
        }
      } catch (error) {
        this.error = error.message || '删除用户失败'
        throw error
      }
    },
    
    // 更新分页
    setPagination(page, pageSize) {
      this.pagination.currentPage = page
      this.pagination.pageSize = pageSize
    }
  }
})