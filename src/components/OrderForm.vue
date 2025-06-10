<!-- src/components/OrderForm.vue -->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    @submit.prevent
  >
    <el-form-item label="订单编号" prop="orderNo">
      <el-input v-model="formData.orderNo" placeholder="请输入订单编号" :disabled="!!formData.id" />
    </el-form-item>
    <el-form-item label="用户名" prop="userName">
      <el-input v-model="formData.userName" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="总金额" prop="totalAmount">
      <el-input-number
        v-model="formData.totalAmount"
        :min="0"
        :precision="2"
        placeholder="请输入总金额"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
        <el-option label="待支付" value="pending" />
        <el-option label="已支付" value="paid" />
        <el-option label="已发货" value="shipped" />
        <el-option label="已送达" value="delivered" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
    </el-form-item>
    <el-form-item label="收货地址" prop="shippingAddress.detail">
      <el-input v-model="formData.shippingAddress.detail" placeholder="请输入收货地址" />
    </el-form-item>
    <el-form-item label="联系人" prop="shippingAddress.contact">
      <el-input v-model="formData.shippingAddress.contact" placeholder="请输入联系人" />
    </el-form-item>
    <el-form-item label="联系电话" prop="shippingAddress.phone">
      <el-input v-model="formData.shippingAddress.phone" placeholder="请输入联系电话" />
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

// 定义订单类型
interface Address {
  detail: string;
  contact: string;
  phone: string;
}

interface Order {
  id?: string;
  orderNo: string;
  userName: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createTime?: string;
}

// 属性和事件
const props = defineProps<{
  order: Order | null;
}>();
const emit = defineEmits<{
  (e: 'submit', order: Order): void;
  (e: 'cancel'): void;
}>();

// 表单数据
const formData = reactive<Order>({
  id: '',
  orderNo: '',
  userName: '',
  totalAmount: 0,
  status: 'pending',
  shippingAddress: {
    detail: '',
    contact: '',
    phone: '',
  },
});

// 表单引用
const formRef = ref<FormInstance | null>(null);

// 表单验证规则
const rules = reactive<FormRules>({
  orderNo: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  totalAmount: [{ required: true, message: '请输入总金额', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  'shippingAddress.detail': [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
  'shippingAddress.contact': [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  'shippingAddress.phone': [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
});

// 监听传入的 order 属性
watch(
  () => props.order,
  (newOrder) => {
    if (newOrder) {
      Object.assign(formData, {
        id: newOrder.id || '',
        orderNo: newOrder.orderNo || '',
        userName: newOrder.userName || '',
        totalAmount: newOrder.totalAmount || 0,
        status: newOrder.status || 'pending',
        shippingAddress: {
          detail: newOrder.shippingAddress?.detail || '',
          contact: newOrder.shippingAddress?.contact || '',
          phone: newOrder.shippingAddress?.phone || '',
        },
      });
    } else {
      Object.assign(formData, {
        id: '',
        orderNo: '',
        userName: '',
        totalAmount: 0,
        status: 'pending',
        shippingAddress: {
          detail: '',
          contact: '',
          phone: '',
        },
      });
    }
  },
  { immediate: true }
);

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
