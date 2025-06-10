// store/category.js
import { defineStore } from 'pinia'
import axios from 'axios'

// 定义分类管理模块的 Pinia store
export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [], // 存储分类列表
  }),

  actions: {
    // 获取分类列表
    async fetchCategories() {
      try {
        const response = await axios.get('/api/category')
        if (response.data.code === 200) {
          this.categories = response.data.data // 提取 data 字段
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
        throw error
      }
    },

    // 添加分类
    async addCategory(category) {
      try {
        const response = await axios.post('/api/category', category)
        if (response.data.code === 200) {
          this.categories.push(response.data.data) // 提取 data 字段
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('添加分类失败:', error)
        throw error
      }
    },

    // 编辑分类
    async updateCategory(id, updatedCategory) {
      try {
        const response = await axios.put(`/api/category/${id}`, updatedCategory)
        if (response.data.code === 200) {
          const index = this.categories.findIndex(category => category.id === id)
          if (index !== -1) {
            this.categories[index] = response.data.data // 更新分类
          }
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('编辑分类失败:', error)
        throw error
      }
    },

    // 删除分类
    async deleteCategory(id) {
      try {
        const response = await axios.delete(`/api/category/${id}`)
        if (response.data.code === 200) {
          this.categories = this.categories.filter(category => category.id !== id) // 移除已删除的分类
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('删除分类失败:', error)
        throw error
      }
    }
  }
})
