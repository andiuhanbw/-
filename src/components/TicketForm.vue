<template>
  <el-form
    ref="ticketFormRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    class="ticket-form"
  >
    <el-form-item label="工单标题" prop="title">
      <el-input
        v-model="formData.title"
        placeholder="请输入工单标题"
        maxlength="100"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="工单类型" prop="type">
      <el-select v-model="formData.type" placeholder="请选择工单类型" style="width: 100%">
        <el-option label="技术支持" value="technical" />
        <el-option label="售后服务" value="service" />
        <el-option label="产品咨询" value="consultation" />
        <el-option label="投诉建议" value="complaint" />
        <el-option label="其他" value="other" />
      </el-select>
    </el-form-item>

    <el-form-item label="优先级" prop="priority">
      <el-select v-model="formData.priority" placeholder="请选择优先级" style="width: 100%">
        <el-option label="低" value="low" />
        <el-option label="中" value="medium" />
        <el-option label="高" value="high" />
        <el-option label="紧急" value="urgent" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="!isEdit" label="用户" prop="userId">
      <el-select
        v-model="formData.userId"
        placeholder="请选择用户"
        style="width: 100%"
        filterable
        remote
        :remote-method="searchUsers"
        :loading="userLoading"
      >
        <el-option
          v-for="user in userOptions"
          :key="user.id"
          :label="`${user.name} (${user.phone})`"
          :value="user.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-if="isEdit" label="处理状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
        <el-option label="待处理" value="pending" />
        <el-option label="处理中" value="processing" />
        <el-option label="已解决" value="resolved" />
        <el-option label="已关闭" value="closed" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="isEdit" label="处理人员" prop="assigneeId">
      <el-select
        v-model="formData.assigneeId"
        placeholder="请选择处理人员"
        style="width: 100%"
        clearable
      >
        <el-option
          v-for="staff in staffOptions"
          :key="staff.id"
          :label="staff.name"
          :value="staff.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="问题描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="4"
        placeholder="请详细描述问题"
        maxlength="1000"
        show-word-limit
      />
    </el-form-item>

    <el-form-item v-if="isEdit" label="处理备注" prop="remarks">
      <el-input
        v-model="formData.remarks"
        type="textarea"
        :rows="3"
        placeholder="请输入处理备注"
        maxlength="500"
        show-word-limit
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        {{ isEdit ? '更新工单' : '创建工单' }}
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  ticketData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'reset'])

const ticketFormRef = ref()
const userLoading = ref(false)
const userOptions = ref([])
const staffOptions = ref([
  { id: 1, name: '张三 - 技术支持' },
  { id: 2, name: '李四 - 客服专员' },
  { id: 3, name: '王五 - 售后服务' }
])

const formData = reactive({
  title: '',
  type: '',
  priority: 'medium',
  userId: '',
  status: 'pending',
  assigneeId: '',
  description: '',
  remarks: ''
})

const rules = {
  title: [
    { required: true, message: '请输入工单标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度应在5-100个字符之间', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择工单类型', trigger: 'change' }
  ],
  priority: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  userId: [
    { required: true, message: '请选择用户', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, max: 1000, message: '描述长度应在10-1000个字符之间', trigger: 'blur' }
  ]
}

// 监听传入的工单数据变化
watch(
  () => props.ticketData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      Object.assign(formData, newData)
    }
  },
  { immediate: true, deep: true }
)

// 搜索用户
const searchUsers = async (query) => {
  if (!query) return
  
  userLoading.value = true
  try {
    // 模拟搜索用户API
    await new Promise(resolve => setTimeout(resolve, 300))
    userOptions.value = [
      { id: 1, name: '用户A', phone: '13800138001' },
      { id: 2, name: '用户B', phone: '13800138002' },
      { id: 3, name: '用户C', phone: '13800138003' }
    ].filter(user => user.name.includes(query) || user.phone.includes(query))
  } catch (error) {
    console.error('搜索用户失败:', error)
  } finally {
    userLoading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await ticketFormRef.value.validate()
    emit('submit', { ...formData })
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}

// 重置表单
const handleReset = () => {
  ticketFormRef.value.resetFields()
  emit('reset')
}

// 暴露验证方法
defineExpose({
  validate: () => ticketFormRef.value.validate(),
  resetFields: () => ticketFormRef.value.resetFields()
})
</script>

<style scoped>
.ticket-form {
  max-width: 600px;
}
</style>
