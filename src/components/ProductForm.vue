<!-- src/components/ProductForm.vue -->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    @submit.prevent
  >
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入商品名称" />
    </el-form-item>
    <el-form-item label="品牌" prop="brand">
      <el-input v-model="formData.brand" placeholder="请输入品牌" />
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input-number
        v-model="formData.price"
        :min="0"
        :precision="2"
        placeholder="请输入价格"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="库存" prop="stock">
      <el-input-number
        v-model="formData.stock"
        :min="0"
        placeholder="请输入库存"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
        <el-option label="上架" value="active" />
        <el-option label="下架" value="inactive" />
        <el-option label="售罄" value="sold_out" />
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="4"
        placeholder="请输入商品描述"
      />
    </el-form-item>
    <el-form-item label="图片" prop="images">
      <el-upload
        v-model:file-list="imageFiles"
        action="/mock/upload"
        list-type="picture-card"
        :limit="2"
        accept="image/*"
        :on-change="handleImageChange"
        :on-remove="handleImageRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch} from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 定义商品类型
interface Product {
  id?: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'sold_out';
  description: string;
  images: string[];
}

// 属性和事件
const props = defineProps<{
  product: Product | null;
}>();
const emit = defineEmits<{
  (e: 'submit', product: Product): void;
  (e: 'cancel'): void;
}>();

// 表单数据
const formData = reactive<Product>({
  id: '',
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  status: 'active',
  description: '',
  images: [],
});

// 图片文件列表
const imageFiles = ref<any[]>([]);

// 表单引用
const formRef = ref<FormInstance | null>(null);

// 表单验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
});

// 监听传入的 product 属性
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      Object.assign(formData, {
        id: newProduct.id || '',
        name: newProduct.name || '',
        brand: newProduct.brand || '',
        price: newProduct.price || 0,
        stock: newProduct.stock || 0,
        status: newProduct.status || 'active',
        description: newProduct.description || '',
        images: newProduct.images || [],
      });
      imageFiles.value = newProduct.images.map((url, index) => ({
        name: `image-${index}`,
        url,
      }));
    } else {
      Object.assign(formData, {
        id: '',
        name: '',
        brand: '',
        price: 0,
        stock: 0,
        status: 'active',
        description: '',
        images: [],
      });
      imageFiles.value = [];
    }
  },
  { immediate: true }
);

// 处理图片上传
const handleImageChange = (file: any) => {
  if (file.status === 'success' && file.url) {
    formData.images.push(file.url);
  }
};

// 处理图片移除
const handleImageRemove = () => {
  formData.images = imageFiles.value.map((file) => file.url);
};

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', { ...formData });
    } else {
      ElMessage.error('请检查表单');
    }
  });
};

// 取消
const handleCancel = () => {
  formRef.value?.resetFields();
  emit('cancel');
};
</script>

<style scoped>
.el-form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
