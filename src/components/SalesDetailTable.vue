<template>
  <div class="sales-detail-table">
    <el-table
      :data="data"
      :loading="loading"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="120"
        sortable
      />
      <el-table-column
        prop="amount"
        label="销售额"
        width="120"
        sortable
      >
        <template #default="{ row }">
          <span class="amount">¥{{ row.amount.toLocaleString() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orders"
        label="订单数"
        width="100"
        sortable
      />
      <el-table-column
        prop="users"
        label="活跃用户"
        width="100"
        sortable
      />
      <el-table-column
        label="平均订单额"
        width="120"
      >
        <template #default="{ row }">
          <span class="amount">¥{{ (row.amount / row.orders).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="趋势"
        width="100"
      >
        <template #default="{ row, $index }">
          <el-tag
            v-if="$index > 0"
            :type="getTrendType(row, data[$index - 1])"
            size="small"
          >
            {{ getTrendText(row, data[$index - 1]) }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const getTrendType = (current, previous) => {
  const change = ((current.amount - previous.amount) / previous.amount) * 100
  if (change > 0) return 'success'
  if (change < 0) return 'danger'
  return 'info'
}

const getTrendText = (current, previous) => {
  const change = ((current.amount - previous.amount) / previous.amount) * 100
  const symbol = change > 0 ? '+' : ''
  return `${symbol}${change.toFixed(1)}%`
}
</script>

<style scoped>
.amount {
  font-weight: 500;
  color: #409EFF;
}
</style>
