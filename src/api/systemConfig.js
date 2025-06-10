import request from './index'

// 模拟系统配置数据
const mockSystemSettings = {
  siteName: '手机商城',
  logo: '/assets/logo.png',
  theme: 'light',
  language: 'zh-CN',
  maintenanceMode: false,
  maxLoginAttempts: 5,
  sessionTimeout: 30
}

const mockPermissionSettings = {
  roles: [
    { id: 1, name: '超级管理员', description: '拥有所有权限' },
    { id: 2, name: '运营管理员', description: '管理商品和订单' },
    { id: 3, name: '客服', description: '处理客户咨询' }
  ],
  permissions: [
    { id: 1, name: '商品管理', code: 'product:manage' },
    { id: 2, name: '订单管理', code: 'order:manage' },
    { id: 3, name: '用户管理', code: 'user:manage' },
    { id: 4, name: '系统设置', code: 'system:config' }
  ],
  rolePermissions: {
    1: ['product:manage', 'order:manage', 'user:manage', 'system:config'],
    2: ['product:manage', 'order:manage'],
    3: []
  }
}

const mockNotificationSettings = {
  email: {
    enabled: true,
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'admin@example.com',
    smtpPass: '******'
  },
  sms: {
    enabled: false,
    provider: 'aliyun',
    apiKey: '',
    senderId: ''
  },
  push: {
    enabled: false,
    pushService: 'jpush',
    pushKey: ''
  }
}

// 获取系统设置
export const getSystemSettings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockSystemSettings
      })
    }, 300)
  })
}

// 更新系统设置
export const updateSystemSettings = (settings) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '更新成功',
        data: { ...mockSystemSettings, ...settings }
      })
    }, 300)
  })
}

// 获取权限配置
export const getPermissionSettings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockPermissionSettings
      })
    }, 300)
  })
}

// 更新权限配置
export const updatePermissionSettings = (settings) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '更新成功',
        data: { ...mockPermissionSettings, ...settings }
      })
    }, 300)
  })
}

// 获取通知配置
export const getNotificationSettings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取成功',
        data: mockNotificationSettings
      })
    }, 300)
  })
}

// 更新通知配置
export const updateNotificationSettings = (settings) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '更新成功',
        data: { ...mockNotificationSettings, ...settings }
      })
    }, 300)
  })
}
