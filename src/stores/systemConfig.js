import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as systemConfigApi from '@/api/systemConfig'

export const useSystemConfigStore = defineStore('systemConfig', () => {
  // 状态数据
  const systemSettings = ref({
    siteName: '',
    logo: '',
    theme: 'light',
    language: 'zh-CN',
    maintenanceMode: false,
    maxLoginAttempts: 5,
    sessionTimeout: 30
  })

  const permissionSettings = ref({
    roles: [],
    permissions: [],
    rolePermissions: {}
  })

  const notificationSettings = ref({
    email: {
      enabled: false,
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPass: ''
    },
    sms: {
      enabled: false,
      provider: '',
      apiKey: '',
      senderId: ''
    },
    push: {
      enabled: false,
      pushService: '',
      pushKey: ''
    }
  })

  const loading = ref(false)

  // 获取系统设置
  const fetchSystemSettings = async () => {
    loading.value = true
    try {
      const response = await systemConfigApi.getSystemSettings()
      systemSettings.value = response.data
      return response
    } catch (error) {
      console.error('获取系统设置失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新系统设置
  const updateSystemSettings = async (settings) => {
    loading.value = true
    try {
      const response = await systemConfigApi.updateSystemSettings(settings)
      systemSettings.value = { ...systemSettings.value, ...settings }
      return response
    } catch (error) {
      console.error('更新系统设置失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取权限配置
  const fetchPermissionSettings = async () => {
    loading.value = true
    try {
      const response = await systemConfigApi.getPermissionSettings()
      permissionSettings.value = response.data
      return response
    } catch (error) {
      console.error('获取权限配置失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新权限配置
  const updatePermissionSettings = async (settings) => {
    loading.value = true
    try {
      const response = await systemConfigApi.updatePermissionSettings(settings)
      permissionSettings.value = { ...permissionSettings.value, ...settings }
      return response
    } catch (error) {
      console.error('更新权限配置失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取通知配置
  const fetchNotificationSettings = async () => {
    loading.value = true
    try {
      const response = await systemConfigApi.getNotificationSettings()
      notificationSettings.value = response.data
      return response
    } catch (error) {
      console.error('获取通知配置失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新通知配置
  const updateNotificationSettings = async (settings) => {
    loading.value = true
    try {
      const response = await systemConfigApi.updateNotificationSettings(settings)
      notificationSettings.value = { ...notificationSettings.value, ...settings }
      return response
    } catch (error) {
      console.error('更新通知配置失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    systemSettings,
    permissionSettings,
    notificationSettings,
    loading,
    fetchSystemSettings,
    updateSystemSettings,
    fetchPermissionSettings,
    updatePermissionSettings,
    fetchNotificationSettings,
    updateNotificationSettings
  }
})
