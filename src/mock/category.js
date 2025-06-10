import Mock from 'mockjs'

// 模拟分类数据
let categories = [
  { id: 1, name: '手机' },
  { id: 2, name: '配件' }
]

// 模拟 GET /mock/category - 获取分类列表
Mock.mock('/mock/category', 'get', () => {
  return {
    code: 200,
    data: categories,
    message: '获取分类列表成功'
  }
})

// 模拟 POST /mock/category - 添加分类
Mock.mock('/mock/category', 'post', (options) => {
  const newCategory = JSON.parse(options.body)
  const id = categories.length + 1
  const category = { id, name: newCategory.name }
  categories.push(category)
  return {
    code: 200,
    data: category,
    message: '添加分类成功'
  }
})

// 模拟 PUT /mock/category/:id - 编辑分类
Mock.mock(/\/mock\/category\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const updatedCategory = JSON.parse(options.body)
  const index = categories.findIndex(category => category.id === id)
  if (index !== -1) {
    categories[index] = { id, name: updatedCategory.name }
    return {
      code: 200,
      data: categories[index],
      message: '编辑分类成功'
    }
  } else {
    return {
      code: 404,
      message: '分类不存在'
    }
  }
})

// 模拟 DELETE /mock/category/:id - 删除分类
Mock.mock(/\/mock\/category\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.split('/').pop())
  const index = categories.findIndex(category => category.id === id)
  if (index !== -1) {
    categories.splice(index, 1)
    return {
      code: 200,
      message: '删除分类成功'
    }
  } else {
    return {
      code: 404,
      message: '分类不存在'
    }
  }
})
