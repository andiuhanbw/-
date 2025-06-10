// mock/inventory.js
import Mock from 'mockjs'

// 生成模拟库存数据
const inventoryList = Mock.mock({
  'items|20-50': [
    {
      'id|+1': 1,
      'productId': '@guid',
      'productName': '@ctitle(3, 8)',
      'productCode': 'P@natural(1000, 9999)',
      'categoryId|1-10': 1,
      'categoryName|1': ['智能手机', '平板电脑', '智能手表', '耳机', '充电器', '手机壳', '屏幕保护膜', '数据线', '移动电源', '蓝牙音箱'],
      'brand|1': ['苹果', '华为', '小米', 'OPPO', 'vivo', '三星', '一加', '荣耀', '魅族', '联想'],
      'stockQuantity|0-1000': 100,
      'safetyStock|10-50': 20,
      'unitPrice|100-8000.2': 1000,
      'supplier': '@cname',
      'supplierContact': '@phone',
      'warehouse|1': ['北京仓', '上海仓', '广州仓', '深圳仓', '成都仓'],
      'warehouseLocation': '@province@city@county',
      'purchaseDate': '@datetime("yyyy-MM-dd")',
      'expiryDate': '@datetime("yyyy-MM-dd")',
      'status|1': ['在库', '缺货', '预警', '停产'],
      'description': '@csentence(10, 30)',
      'images|1-3': ['@image("200x200")'],
      'createTime': '@datetime',
      'updateTime': '@datetime',
      'createdBy': '@cname',
      'updatedBy': '@cname'
    }
  ]
})

// 获取库存列表
Mock.mock('/api/inventory/list', 'get', (options) => {
  const { page = 1, pageSize = 10, keyword = '', categoryId = '', status = '' } = JSON.parse(options.body || '{}')
  
  let filteredItems = inventoryList.items
  
  // 关键字搜索
  if (keyword) {
    filteredItems = filteredItems.filter(item => 
      item.productName.includes(keyword) || 
      item.productCode.includes(keyword) ||
      item.brand.includes(keyword)
    )
  }
  
  // 分类筛选
  if (categoryId) {
    filteredItems = filteredItems.filter(item => item.categoryId == categoryId)
  }
  
  // 状态筛选
  if (status) {
    filteredItems = filteredItems.filter(item => item.status === status)
  }
  
  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pageItems = filteredItems.slice(start, end)
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      items: pageItems,
      total: filteredItems.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
})

// 获取单个库存详情
Mock.mock(/\/api\/inventory\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const item = inventoryList.items.find(item => item.id === id)
  
  if (item) {
    return {
      code: 200,
      message: '获取成功',
      data: item
    }
  } else {
    return {
      code: 404,
      message: '库存记录不存在'
    }
  }
})

// 添加库存
Mock.mock('/api/inventory', 'post', (options) => {
  const newItem = JSON.parse(options.body)
  const maxId = Math.max(...inventoryList.items.map(item => item.id))
  
  const item = {
    id: maxId + 1,
    productId: Mock.mock('@guid'),
    createTime: Mock.mock('@datetime'),
    updateTime: Mock.mock('@datetime'),
    createdBy: '管理员',
    updatedBy: '管理员',
    ...newItem
  }
  
  inventoryList.items.unshift(item)
  
  return {
    code: 200,
    message: '添加成功',
    data: item
  }
})

// 更新库存
Mock.mock(/\/api\/inventory\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const updateData = JSON.parse(options.body)
  const index = inventoryList.items.findIndex(item => item.id === id)
  
  if (index !== -1) {
    inventoryList.items[index] = {
      ...inventoryList.items[index],
      ...updateData,
      updateTime: Mock.mock('@datetime'),
      updatedBy: '管理员'
    }
    
    return {
      code: 200,
      message: '更新成功',
      data: inventoryList.items[index]
    }
  } else {
    return {
      code: 404,
      message: '库存记录不存在'
    }
  }
})

// 删除库存
Mock.mock(/\/api\/inventory\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const index = inventoryList.items.findIndex(item => item.id === id)
  
  if (index !== -1) {
    inventoryList.items.splice(index, 1)
    return {
      code: 200,
      message: '删除成功'
    }
  } else {
    return {
      code: 404,
      message: '库存记录不存在'
    }
  }
})

// 批量删除库存
Mock.mock('/api/inventory/batch-delete', 'post', (options) => {
  const { ids } = JSON.parse(options.body)
  
  ids.forEach(id => {
    const index = inventoryList.items.findIndex(item => item.id === id)
    if (index !== -1) {
      inventoryList.items.splice(index, 1)
    }
  })
  
  return {
    code: 200,
    message: '批量删除成功'
  }
})

// 库存盘点
Mock.mock('/api/inventory/stocktaking', 'post', (options) => {
  const { id, actualQuantity, remark } = JSON.parse(options.body)
  const index = inventoryList.items.findIndex(item => item.id === id)
  
  if (index !== -1) {
    const item = inventoryList.items[index]
    const difference = actualQuantity - item.stockQuantity
    
    inventoryList.items[index] = {
      ...item,
      stockQuantity: actualQuantity,
      updateTime: Mock.mock('@datetime'),
      updatedBy: '管理员',
      lastStocktaking: Mock.mock('@datetime'),
      stocktakingRemark: remark
    }
    
    return {
      code: 200,
      message: '盘点成功',
      data: {
        item: inventoryList.items[index],
        difference: difference
      }
    }
  } else {
    return {
      code: 404,
      message: '库存记录不存在'
    }
  }
})

// 库存预警列表
Mock.mock('/api/inventory/warning', 'get', () => {
  const warningItems = inventoryList.items.filter(item => 
    item.stockQuantity <= item.safetyStock
  )
  
  return {
    code: 200,
    message: '获取成功',
    data: warningItems
  }
})

// 库存统计
Mock.mock('/api/inventory/statistics', 'get', () => {
  const total = inventoryList.items.length
  const inStock = inventoryList.items.filter(item => item.status === '在库').length
  const outOfStock = inventoryList.items.filter(item => item.status === '缺货').length
  const warning = inventoryList.items.filter(item => item.stockQuantity <= item.safetyStock).length
  const totalValue = inventoryList.items.reduce((sum, item) => sum + (item.stockQuantity * item.unitPrice), 0)
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      total,
      inStock,
      outOfStock,
      warning,
      totalValue: totalValue.toFixed(2)
    }
  }
})

// 获取分类列表
Mock.mock('/api/inventory/categories', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: [
      { id: 1, name: '智能手机' },
      { id: 2, name: '平板电脑' },
      { id: 3, name: '智能手表' },
      { id: 4, name: '耳机' },
      { id: 5, name: '充电器' },
      { id: 6, name: '手机壳' },
      { id: 7, name: '屏幕保护膜' },
      { id: 8, name: '数据线' },
      { id: 9, name: '移动电源' },
      { id: 10, name: '蓝牙音箱' }
    ]
  }
})

// 获取仓库列表
Mock.mock('/api/inventory/warehouses', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: [
      { id: 1, name: '北京仓', location: '北京市朝阳区' },
      { id: 2, name: '上海仓', location: '上海市浦东新区' },
      { id: 3, name: '广州仓', location: '广州市天河区' },
      { id: 4, name: '深圳仓', location: '深圳市南山区' },
      { id: 5, name: '成都仓', location: '成都市高新区' }
    ]
  }
})

// 库存流水记录
Mock.mock('/api/inventory/logs', 'get', (options) => {
  const { productId, page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  
  const logs = Mock.mock({
    [`items|${pageSize}`]: [
      {
        'id|+1': 1,
        'productId': productId || '@guid',
        'type|1': ['入库', '出库', '盘点', '调拨', '损耗'],
        'quantity|1-100': 10,
        'beforeQuantity|0-1000': 100,
        'afterQuantity|0-1000': 90,
        'reason': '@csentence(5, 15)',
        'operator': '@cname',
        'createTime': '@datetime',
        'remark': '@csentence(10, 20)'
      }
    ]
  })
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      items: logs.items,
      total: 100,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
})

export default inventoryList
