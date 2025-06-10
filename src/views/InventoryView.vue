<template>
  <div class="inventory-view">
    <h1>Inventory Management</h1>
    <el-card>
      <inventory-form
        :edit-product="selectedProduct"
        @product-added="fetchInventory"
        @product-updated="fetchInventory"
      />
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-table :data="inventoryList" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="Product Name" />
        <el-table-column prop="quantity" label="Quantity" />
        <el-table-column prop="price" label="Price" :formatter="row => `$${row.price.toFixed(2)}`" />
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editProduct(row)">Edit</el-button>
            <el-button type="danger" size="small" @click="deleteProduct(row.id)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-alert v-if="error" :title="error" type="error" :closable="false" style="margin-top: 20px;" />
  </div>
</template>

<script>
import { useInventoryStore } from '@/stores/inventory';
import InventoryForm from '@/components/InventoryForm.vue';
import { ref } from 'vue';

export default {
  components: { InventoryForm },
  setup() {
    const inventoryStore = useInventoryStore();
    const inventoryList = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const selectedProduct = ref(null);

    const fetchInventory = async () => {
      loading.value = true;
      await inventoryStore.fetchInventory();
      inventoryList.value = inventoryStore.inventoryList;
      loading.value = inventoryStore.loading;
      error.value = inventoryStore.error;
    };

    fetchInventory();

    const deleteProduct = async (productId) => {
      try {
        await inventoryStore.deleteProduct(productId);
        fetchInventory();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    };

    const editProduct = (product) => {
      selectedProduct.value = { ...product };
    };

    return {
      inventoryList,
      loading,
      error,
      selectedProduct,
      fetchInventory,
      deleteProduct,
      editProduct,
    };
  },
};
</script>

<style scoped>
.inventory-view {
  padding: 20px;
}
</style>
