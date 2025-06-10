import Mock from 'mockjs'

// 模拟订单数据
let orders = [
  { id: 1, orderNo: 'ORD001', product: '手机', quantity: 10, status: '已发货', userId: 1 },
  { id: 2, orderNo: 'ORD002', product: '耳机', quantity: 5, status: '待处理', userId: 2 }
]

// 模拟 GET /mock/orders - 获取订单列表
Mock.mock(/\/mock\/orders(\?.*)?$/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1] || '')
  const page = parseInt(params.get('page') || 1)
  const pageSize = parseInt(params.get('pageSize') || 10)
  const status = params.get('status')
  const orderNo = params.get('orderNo')
  const userId = params.get('userId')

  let filteredOrders = orders
  if (status) filteredOrders = filteredOrders.filter(order => order.status === status)
  if (orderNo) filteredOrders = filteredOrders.filter(order => order.orderNo.includes(orderNo))
  if (userId) filteredOrders = filteredOrders.filter(order => order.userId === parseInt(userId))

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedOrders = filteredOrders.slice(start, end)

  return {
    code: 200,
    data: {
      list: paginatedOrders,
      total: filteredOrders.length,
      page,
      pageSize
    },
    message: '获取订单列表成功'
  }
})

// 模拟 GET /mock/orders/:id - 获取单个订单
Mock.mock(/\/mock\/orders\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const order = orders.find(o => o.id === id)
  if (order) {
    return {
      code: 200,
      data: order,
      message: '获取订单详情成功'
    }
  } else {
    return {
      code: 404,
      message: '订单不存在'
    }
  }
})

// 模拟 POST /mock/orders - 创建订单
Mock.mock('/mock/orders', 'post', (options) => {
  const newOrder = JSON.parse(options.body)
  const id = orders.length + 1
  const order = { id, orderNo: `ORD${String(id).padStart(3, '0')}`, ...newOrder }
  orders.push(order)
  return {
    code: 200,
    data: order,
    message: '添加订单成功'
  }
})

// 模拟 PUT /mock/orders/:id - 更新订单
Mock.mock(/\/mock\/orders\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const updatedOrder = JSON.parse(options.body)
  const index = orders.findIndex(o => o.id === id)
  if (index !== -1) {
    orders[index] = { id, ...updatedOrder }
    return {
      code: 200,
      data: orders[index],
      message: '更新订单成功'
    }
  } else {
    return {
      code: 404,
      message: '订单不存在'
    }
  }
})

// 模拟 DELETE /mock/orders/:id - 删除订单
Mock.mock(/\/mock\/orders\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const index = orders.findIndex(o => o.id === id)
  if (index !== -1) {
    orders.splice(index, 1)
    return {
      code: 200,
      message: '删除订单成功'
    }
  } else {
    return {
      code: 404,
      message: '订单不存在'
    }
  }
})
