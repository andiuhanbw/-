    import Mock from 'mockjs'

// 生成模拟数据
const generateTickets = () => {
  const tickets = []
  for (let i = 1; i <= 50; i++) {
    tickets.push({
      id: i,
      title: Mock.Random.ctitle(5, 15),
      type: Mock.Random.pick(['technical', 'product', 'service', 'complaint']),
      priority: Mock.Random.pick(['low', 'medium', 'high', 'urgent']),
      status: Mock.Random.pick(['pending', 'processing', 'resolved', 'closed']),
      customerName: Mock.Random.cname(),
      phone: /^1[3-9]\d{9}$/,
      email: Mock.Random.email(),
      description: Mock.Random.cparagraph(3, 8),
      solution: Mock.Random.cparagraph(2, 5),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      replies: Mock.Random.range(0, 5).map(() => ({
        user: Mock.Random.pick(['客服A', '客服B', '技术支持', '经理']),
        content: Mock.Random.cparagraph(1, 3),
        time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
      }))
    })
  }
  return tickets
}

let ticketList = generateTickets()

// 获取工单列表
Mock.mock(/\/api\/tickets$/, 'get', (options) => {
  const url = new URL('http://localhost' + options.url)
  const page = parseInt(url.searchParams.get('page')) || 1
  const size = parseInt(url.searchParams.get('size')) || 10
  const title = url.searchParams.get('title') || ''
  const type = url.searchParams.get('type') || ''
  const status = url.searchParams.get('status') || ''

  // 筛选数据
  let filteredList = ticketList.filter(ticket => {
    return (!title || ticket.title.includes(title)) &&
           (!type || ticket.type === type) &&
           (!status || ticket.status === status)
  })

  // 分页
  const start = (page - 1) * size
  const end = start + size
  const list = filteredList.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredList.length
    }
  }
})

// 获取工单详情
Mock.mock(/\/api\/tickets\/\d+$/, 'get', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const ticket = ticketList.find(t => t.id === id)
  
  return {
    code: 200,
    message: 'success',
    data: ticket
  }
})

// 创建工单
Mock.mock('/api/tickets', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newTicket = {
    id: Math.max(...ticketList.map(t => t.id)) + 1,
    ...body,
    status: 'pending',
    createTime: new Date().toLocaleString(),
    updateTime: new Date().toLocaleString(),
    replies: []
  }
  ticketList.unshift(newTicket)
  
  return {
    code: 200,
    message: '创建成功',
    data: newTicket
  }
})

// 更新工单
Mock.mock(/\/api\/tickets\/\d+$/, 'put', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const body = JSON.parse(options.body)
  const index = ticketList.findIndex(t => t.id === id)
  
  if (index !== -1) {
    ticketList[index] = {
      ...ticketList[index],
      ...body,
      updateTime: new Date().toLocaleString()
    }
    return {
      code: 200,
      message: '更新成功',
      data: ticketList[index]
    }
  }
  
  return {
    code: 404,
    message: '工单不存在'
  }
})

// 删除工单
Mock.mock(/\/api\/tickets\/\d+$/, 'delete', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const index = ticketList.findIndex(t => t.id === id)
  
  if (index !== -1) {
    ticketList.splice(index, 1)
    return {
      code: 200,
      message: '删除成功'
    }
  }
  
  return {
    code: 404,
    message: '工单不存在'
  }
})

// 回复工单
Mock.mock(/\/api\/tickets\/\d+\/reply$/, 'post', (options) => {
  const id = parseInt(options.url.split('/')[3])
  const body = JSON.parse(options.body)
  const ticket = ticketList.find(t => t.id === id)
  
  if (ticket) {
    ticket.replies.push({
      ...body,
      time: new Date().toLocaleString()
    })
    ticket.updateTime = new Date().toLocaleString()
    
    return {
      code: 200,
      message: '回复成功',
      data: ticket
    }
  }
  
  return {
    code: 404,
    message: '工单不存在'
  }
})
