<template>
  <div class="ticket-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客服工单管理</span>
          <el-button type="primary" @click="showCreateDialog">
            新建工单
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="工单标题">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入工单标题"
            clearable
          />
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="技术支持" value="technical" />
            <el-option label="产品咨询" value="product" />
            <el-option label="售后服务" value="service" />
            <el-option label="投诉建议" value="complaint" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工单列表 -->
      <el-table
        :data="ticketStore.ticketList"
        :loading="ticketStore.loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="工单ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityTagType(row.priority)">
              {{ getPriorityLabel(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="showDetailDialog(row)">
              详情
            </el-button>
            <el-button type="warning" size="small" @click="showEditDialog(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="ticketStore.pagination.page"
        v-model:page-size="ticketStore.pagination.size"
        :total="ticketStore.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: center"
      />
    </el-card>

    <!-- 新建/编辑工单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="60%"
      @close="handleDialogClose"
    >
      <TicketForm
        :model-value="currentTicket"
        :is-create="isCreate"
        @submit="handleFormSubmit"
        @cancel="handleDialogClose"
      />
    </el-dialog>

    <!-- 工单详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="工单详情" width="70%">
      <div v-if="ticketStore.currentTicket" class="ticket-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单ID">
            {{ ticketStore.currentTicket.id }}
          </el-descriptions-item>
          <el-descriptions-item label="工单标题">
            {{ ticketStore.currentTicket.title }}
          </el-descriptions-item>
          <el-descriptions-item label="工单类型">
            <el-tag :type="getTypeTagType(ticketStore.currentTicket.type)">
              {{ getTypeLabel(ticketStore.currentTicket.type) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityTagType(ticketStore.currentTicket.priority)">
              {{ getPriorityLabel(ticketStore.currentTicket.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(ticketStore.currentTicket.status)">
              {{ getStatusLabel(ticketStore.currentTicket.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="客户姓名">
            {{ ticketStore.currentTicket.customerName }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ ticketStore.currentTicket.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱地址">
            {{ ticketStore.currentTicket.email }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ ticketStore.currentTicket.createTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ ticketStore.currentTicket.updateTime }}
          </el-descriptions-item>
          <el-descriptions-item label="问题描述" :span="2">
            {{ ticketStore.currentTicket.description }}
          </el-descriptions-item>
          <el-descriptions-item label="处理意见" :span="2">
            {{ ticketStore.currentTicket.solution || '暂无处理意见' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 回复区域 -->
        <div class="reply-section" style="margin-top: 20px;">
          <h3>回复记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(reply, index) in ticketStore.currentTicket.replies"
              :key="index"
              :timestamp="reply.time"
              placement="top"
            >
              <el-card>
                <p><strong>回复人:</strong> {{ reply.user }}</p>
                <p><strong>内容:</strong> {{ reply.content }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-form style="margin-top: 20px;">
            <el-form-item label="添加回复">
              <el-input
                v-model="replyContent"
                type="textarea"
                :rows="3"
                placeholder="请输入回复内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleReplySubmit">
                提交回复
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useTicketStore } from '@/stores/ticket'
import TicketForm from '@/components/TicketForm.vue'

const ticketStore = useTicketStore()

// 搜索表单
const searchForm = reactive({
  title: '',
  type: '',
  status: ''
})

// 对话框相关
const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const isCreate = ref(true)
const currentTicket = ref({})
const dialogTitle = ref('新建工单')
const replyContent = ref('')

// 工单类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    technical: '技术支持',
    product: '产品咨询',
    service: '售后服务',
    complaint: '投诉建议'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type) => {
  const typeTagMap = {
    technical: 'success',
    product: 'info',
    service: 'warning',
    complaint: 'danger'
  }
  return typeTagMap[type] || ''
}

// 优先级标签
const getPriorityLabel = (priority) => {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

const getPriorityTagType = (priority) => {
  const priorityTagMap = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return priorityTagMap[priority] || ''
}

// 状态标签
const getStatusLabel = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status) => {
  const statusTagMap = {
    pending: 'info',
    processing: 'warning',
    resolved: 'success',
    closed: ''
  }
  return statusTagMap[status] || ''
}

// 搜索
const handleSearch = () => {
  ticketStore.pagination.page = 1
  ticketStore.fetchTicketList(searchForm)
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.type = ''
  searchForm.status = ''
  ticketStore.pagination.page = 1
  ticketStore.fetchTicketList()
}

// 分页处理
const handleSizeChange = (size) => {
  ticketStore.pagination.size = size
  ticketStore.fetchTicketList(searchForm)
}

const handleCurrentChange = (page) => {
  ticketStore.pagination.page = page
  ticketStore.fetchTicketList(searchForm)
}

// 显示新建工单对话框
const showCreateDialog = () => {
  isCreate.value = true
  dialogTitle.value = '新建工单'
  currentTicket.value = {}
  dialogVisible.value = true
}

// 显示编辑工单对话框
const showEditDialog = (row) => {
  isCreate.value = false
  dialogTitle.value = '编辑工单'
  currentTicket.value = { ...row }
  dialogVisible.value = true
}

// 显示详情对话框
const showDetailDialog = (row) => {
  ticketStore.fetchTicketDetail(row.id)
  detailDialogVisible.value = true
  replyContent.value = ''
}

// 关闭对话框
const handleDialogClose = () => {
  dialogVisible.value = false
  currentTicket.value = {}
}

// 提交表单
const handleFormSubmit = async (formData) => {
  try {
    if (isCreate.value) {
      await ticketStore.addTicket(formData)
      ElMessage.success('创建工单成功')
    } else {
      await ticketStore.editTicket(currentTicket.value.id, formData)
      ElMessage.success('更新工单成功')
    }
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除工单
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除此工单吗?', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await ticketStore.removeTicket(row.id)
      ElMessage.success('删除工单成功')
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 提交回复
const handleReplySubmit = async () => {
  if (!replyContent.value) {
    ElMessage.error('请输入回复内容')
    return
  }
  try {
    await ticketStore.addReply(ticketStore.currentTicket.id, {
      content: replyContent.value,
      user: '当前用户', // 假设当前登录用户
      time: new Date().toLocaleString()
    })
    ElMessage.success('回复成功')
    replyContent.value = ''
  } catch (error) {
    ElMessage.error('回复失败')
  }
}

// 初始化加载工单列表
ticketStore.fetchTicketList()
</script>

<style scoped>
.ticket-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-form {
  margin-bottom: 20px;
}
.ticket-detail {
  padding: 10px;
}
</style>
