<template>
  <el-form :model="product" :rules="rules" ref="productForm" @submit.prevent="handleSubmit">
    <el-form-item label="Product Name" prop="name">
      <el-input v-model="product.name" placeholder="Enter product name" />
    </el-form-item>
    <el-form-item label="Quantity" prop="quantity">
      <el-input-number v-model="product.quantity" :min="0" placeholder="Enter quantity" />
    </el-form-item>
    <el-form-item label="Price" prop="price">
      <el-input-number v-model="product.price" :min="0" :precision="2" placeholder="Enter price" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">Save</el-button>
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { useInventoryStore } from '@/stores/inventory';
import { ref } from 'vue';

export default {
  props: {
    editProduct: { type: Object, default: null },
  },
  setup(props, { emit }) {
    const product = ref({
      name: props.editProduct?.name || '',
      quantity: props.editProduct?.quantity || 0,
      price: props.editProduct?.price || 0,
    });

    const productForm = ref(null);
    const rules = {
      name: [{ required: true, message: 'Product name is required', trigger: 'blur' }],
      quantity: [{ required: true, message: 'Quantity is required', trigger: 'blur' }],
      price: [{ required: true, message: 'Price is required', trigger: 'blur' }],
    };

    const inventoryStore = useInventoryStore();

    const handleSubmit = async () => {
      try {
        await productForm.value.validate();
        if (props.editProduct?.id) {
          await inventoryStore.updateProduct(props.editProduct.id, product.value);
          emit('product-updated');
        } else {
          await inventoryStore.addProduct(product.value);
          emit('product-added');
        }
        resetForm();
      } catch (error) {
        console.error('Form submission failed:', error);
      }
    };

    const resetForm = () => {
      product.value = { name: '', quantity: 0, price: 0 };
      productForm.value.resetFields();
    };

    return { product, productForm, rules, handleSubmit, resetForm };
  },
};
</script>

<style scoped>
.el-form {
  max-width: 600px;
  margin: 20px auto;
}
</style>
