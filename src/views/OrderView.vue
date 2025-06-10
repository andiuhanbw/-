<!-- src/views/OrderView.vue -->
<template>
  <div class="order-view">
    <!-- 搜索和筛选栏 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="请输入订单编号或用户名"
          clearable
          @input="handleSearch"
        >
          <template #prepend>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="statusFilter"
          placeholder="筛选订单状态"
          clearable
          @change="handleSearch"
          style="width: 100%"
        >
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已发货" value="shipped" />
          <el-option label="已送达" value="delivered" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-col>
      <el-col :span="10" style="text-align: right">
        <el-button type="primary" @click="openForm">
          <el-icon style="margin-right: 5px"><Plus /></el-icon>新增订单
        </el-button>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <el-table
      :data="orderStore.orders"
      v-loading="orderStore.loading"
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="orderNo" label="订单编号" width="150" sortable />
      <el-table-column prop="userName" label="用户名" width="120" />
      <el-table-column prop="totalAmount" label="总金额" width="120" sortable>
        <template #default="{ row }">
          ¥{{ row.totalAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" sortable />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="editOrder(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="deleteOrder(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="orderStore.page"
      v-model:page-size="orderStore.pageSize"
      :total="orderStore.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />

    <!-- 新增/编辑表单对话框 -->
    <el-dialog
      :title="selectedOrder ? '编辑订单' : '新增订单'"
      v-model="showForm"
      width="600px"
      :close-on-click-modal="false"
    >
      <order-form :order="selectedOrder" @submit="saveOrder" @cancel="closeForm" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/order.js';
import OrderForm from '../components/OrderForm.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';

// Pinia 状态
const orderStore = useOrderStore();

// 搜索和筛选状态
const searchQuery = ref('');
const statusFilter = ref('');
const showForm = ref(false);
const selectedOrder = ref(null);

// 状态映射
const statusMap = {
  pending: '待支付',
  paid: '已支付',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消',
};
const getStatusTagType = computed(() => (status: string) => {
  return {
    pending: 'warning',
    paid: 'success',
    shipped: 'info',
    delivered: 'primary',
    cancelled: 'danger',
  }[status] || '';
});

// 获取订单列表
const fetchOrders = (params = {}) => {
  orderStore.fetchOrders({
    keyword: searchQuery.value,
    status: statusFilter.value,
    ...params,
  });
};
fetchOrders();

// 搜索和筛选
const handleSearch = () => {
  orderStore.page = 1;
  fetchOrders();
};

// 排序
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  fetchOrders({
    sortField: prop,
    sortOrder: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '',
  });
};

// 分页
const handlePageSizeChange = (size: number) => {
  orderStore.pageSize = size;
  orderStore.page = 1;
  fetchOrders();
};
const handlePageChange = (page: number) => {
  orderStore.page = page;
  fetchOrders();
};

// 新增订单
const openForm = () => {
  selectedOrder.value = null;
  showForm.value = true;
};

// 编辑订单
const editOrder = (order: any) => {
  selectedOrder.value = { ...order };
  showForm.value = true;
};

// 保存订单
const saveOrder = async (order: any) => {
  try {
    if (selectedOrder.value) {
      await orderStore.updateOrder(selectedOrder.value.id, order);
      ElMessage.success('订单更新成功');
    } else {
      await orderStore.addOrder(order);
      ElMessage.success('订单新增成功');
    }
    showForm.value = false;
    fetchOrders();
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

// 删除订单
const deleteOrder = (id: string) => {
  ElMessageBox.confirm('确定删除该订单吗？', '提示', {
    type: 'warning',
  })
    .then(async () => {
      await orderStore.removeOrder(id);
      ElMessage.success('删除成功');
      fetchOrders();
    })
    .catch(() => {});
};

// 关闭表单
const closeForm = () => {
  showForm.value = false;
};
</script>

<style scoped>
.order-view {
  padding: 20px;
}
</style>
