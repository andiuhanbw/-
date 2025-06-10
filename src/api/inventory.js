import axios from 'axios';

const API_URL = '/mock/inventory';

// 获取库存列表（支持分页和筛选）
export const getInventoryList = (params = {}) => 
  axios.get(API_URL, { params });

// 根据ID获取单个库存项详情
export const getInventoryById = (id) => 
  axios.get(`${API_URL}/${id}`);

// 创建新库存项
export const createInventory = (data) => 
  axios.post(API_URL, data);

// 更新库存项
export const updateInventory = (id, data) => 
  axios.put(`${API_URL}/${id}`, data);

// 删除库存项
export const deleteInventory = (id) => 
  axios.delete(`${API_URL}/${id}`);

// 批量删除库存项
export const batchDeleteInventory = (ids) => 
  axios.post(`${API_URL}/batch-delete`, { ids });

// 库存盘点
export const stocktaking = (data) => 
  axios.post(`${API_URL}/stocktaking`, data);

// 获取库存预警列表
export const getWarningInventory = () => 
  axios.get(`${API_URL}/warning`);

// 获取库存统计数据
export const getInventoryStatistics = () => 
  axios.get(`${API_URL}/statistics`);

// 获取分类列表
export const getCategories = () => 
  axios.get(`${API_URL}/categories`);

// 获取仓库列表
export const getWarehouses = () => 
  axios.get(`${API_URL}/warehouses`);

// 获取库存操作日志
export const getInventoryLogs = (params = {}) => 
  axios.get(`${API_URL}/logs`, { params });

// 调整库存数量
export const adjustStock = (id, data) => 
  axios.post(`${API_URL}/${id}/adjust`, data);

// 库存转移
export const transferStock = (data) => 
  axios.post(`${API_URL}/transfer`, data);

// 导出库存数据
export const exportInventory = (params = {}) => 
  axios.get(`${API_URL}/export`, { params, responseType: 'blob' });

// 导入库存数据
export const importInventory = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
