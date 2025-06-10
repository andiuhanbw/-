<!-- src/views/ProductView.vue -->
<template>
  <div class="product-view">
    <!-- 搜索和操作栏 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="请输入商品名称或品牌"
          clearable
          @input="handleSearch"
        >
          <template #prepend>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <el-button type="primary" @click="openForm">
          <el-icon style="margin-right: 5px"><Plus /></el-icon>新增商品
        </el-button>
      </el-col>
    </el-row>

    <!-- 商品列表 -->
    <el-table
      :data="productStore.products"
      v-loading="productStore.loading"
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="100" sortable />
      <el-table-column prop="name" label="商品名称" min-width="200" />
      <el-table-column prop="brand" label="品牌" width="120" />
      <el-table-column prop="price" label="价格" width="120" sortable>
        <template #default="{ row }">
          ¥{{ row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" sortable />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="editProduct(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteProduct(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="productStore.page"
      v-model:page-size="productStore.pageSize"
      :total="productStore.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />

    <!-- 新增/编辑表单对话框 -->
    <el-dialog
      :title="selectedProduct ? '编辑商品' : '新增商品'"
      v-model="showForm"
      width="600px"
      :close-on-click-modal="false"
    >
      <product-form
        :product="selectedProduct"
        @submit="saveProduct"
        @cancel="closeForm"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductStore } from '../stores/product';
import ProductForm from '../components/ProductForm.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';

// Pinia 状态
const productStore = useProductStore();

// 搜索和表单状态
const searchQuery = ref('');
const showForm = ref(false);
const selectedProduct = ref(null);

// 状态映射
const statusMap = {
  active: '上架',
  inactive: '下架',
  sold_out: '售罄',
};
const getStatusTagType = computed(() => (status) => {
  return {
    active: 'success',
    inactive: 'danger',
    sold_out: 'warning',
  }[status] || '';
});

// 获取商品列表
const fetchProducts = (params = {}) => {
  productStore.fetchProducts({
    keyword: searchQuery.value,
    ...params,
  });
};
fetchProducts();

// 搜索
const handleSearch = () => {
  productStore.page = 1;
  fetchProducts();
};

// 排序
const handleSortChange = ({ prop, order }) => {
  fetchProducts({
    sortField: prop,
    sortOrder: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '',
  });
};

// 分页
const handlePageSizeChange = (size) => {
  productStore.pageSize = size;
  productStore.page = 1;
  fetchProducts();
};
const handlePageChange = (page) => {
  productStore.page = page;
  fetchProducts();
};

// 新增商品
const openForm = () => {
  selectedProduct.value = null;
  showForm.value = true;
};

// 编辑商品
const editProduct = (product) => {
  selectedProduct.value = { ...product };
  showForm.value = true;
};

// 保存商品
const saveProduct = async (product) => {
  try {
    if (selectedProduct.value) {
      await productStore.updateProduct(selectedProduct.value.id, product);
      ElMessage.success('商品更新成功');
    } else {
      await productStore.addProduct(product);
      ElMessage.success('商品新增成功');
    }
    showForm.value = false;
    fetchProducts();
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

// 删除商品
const deleteProduct = (id) => {
  ElMessageBox.confirm('确定删除该商品吗？', '提示', {
    type: 'warning',
  }).then(async () => {
    await productStore.removeProduct(id);
    ElMessage.success('删除成功');
    fetchProducts();
  }).catch(() => {});
};

// 关闭表单
const closeForm = () => {
  showForm.value = false;
};
</script>

<style scoped>
.product-view {
  padding: 20px;
}
</style>
