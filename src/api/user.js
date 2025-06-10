import axios from '@/utils/request'

export const userApi = {
  // 获取用户列表
  getUsers(params) {
    return axios.get('/api/users', { params })
  },

  // 获取单个用户
  getUserById(id) {
    return axios.get(`/api/users/${id}`)
  },

  // 创建用户
  createUser(data) {
    return axios.post('/api/users', data)
  },

  // 更新用户
  updateUser(id, data) {
    return axios.put(`/api/users/${id}`, data)
  },

  // 删除用户
  deleteUser(id) {
    return axios.delete(`/api/users/${id}`)
  },

  // 批量删除用户
  batchDeleteUsers(ids) {
    return axios.delete('/api/users/batch', { data: { ids } })
  },

  // 重置用户密码
  resetPassword(id) {
    return axios.post(`/api/users/${id}/reset-password`)
  }
}
