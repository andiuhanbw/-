import axios from 'axios'

export const getCategories = (params) => {
  return axios.get('/mock/category', { params })
}

export const getCategoryById = (id) => {
  return axios.get(`/mock/category/${id}`)
}

export const createCategory = (data) => {
  return axios.post('/mock/category', data)
}

export const updateCategory = (id, data) => {
  return axios.put(`/mock/category/${id}`, data)
}

export const deleteCategory = (id) => {
  return axios.delete(`/mock/category/${id}`)
}
