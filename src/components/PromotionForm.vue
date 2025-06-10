<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="120px"
    class="promotion-form"
  >
    <el-form-item label="活动名称" prop="name">
      <el-input
        v-model="formData.name"
        placeholder="请输入活动名称"
        maxlength="50"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="活动类型" prop="type">
      <el-select v-model="formData.type" placeholder="请选择活动类型">
        <el-option label="满减" value="满减" />
        <el-option label="折扣" value="折扣" />
        <el-option label="买赠" value="买赠" />
        <el-option label="秒杀" value="秒杀" />
      </el-select>
    </el-form-item>

    <el-form-item label="活动描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="3"
        placeholder="请输入活动描述"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="活动时间" prop="timeRange">
      <el-date-picker
        v-model="timeRange"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="handleTimeChange"
      />
    </el-form-item>

    <el-form-item label="优惠类型" prop="discountType">
      <el-radio-group v-model="formData.discountType">
        <el-radio value="amount">固定金额</el-radio>
        <el-radio value="percent">百分比</el-radio>
        <el-radio value="gift">买赠</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item 
      v-if="formData.discountType !== 'gift'"
      label="优惠值" 
      prop="discountValue"
    >
      <el-input-number
        v-model="formData.discountValue"
        :min="0"
        :max="formData.discountType === 'percent' ? 100 : 10000"
        :precision="formData.discountType === 'percent' ? 0 : 2"
      />
      <span v-if="formData.discountType === 'amount'" class="unit">元</span>
      <span v-if="formData.discountType === 'percent'" class="unit">%</span>
    </el-form-item>

    <el-form-item 
      v-if="formData.type === '满减'"
      label="最低消费" 
      prop="minAmount"
    >
      <el-input-number
        v-model="formData.minAmount"
        :min="0"
        :precision="2"
      />
      <span class="unit">元</span>
    </el-form-item>

    <el-form-item 
      v-if="formData.discountType === 'percent'"
      label="最大优惠" 
      prop="maxDiscount"
    >
      <el-input-number
        v-model="formData.maxDiscount"
        :min="0"
        :precision="2"
      />
      <span class="unit">元</span>
    </el-form-item>

    <el-form-item label="使用限制" prop="usageLimit">
      <el-input-number
        v-model="formData.usageLimit"
        :min="1"
        :max="99999"
      />
      <span class="unit">次</span>
    </el-form-item>

    <el-form-item label="适用商品" prop="applicableProducts">
      <el-select
        v-model="formData.applicableProducts"
        multiple
        placeholder="请选择适用商品"
        style="width: 100%"
      >
        <el-option label="全部商品" value="全部商品" />
        <el-option label="iPhone 15" value="iPhone 15" />
        <el-option label="iPhone 14" value="iPhone 14" />
        <el-option label="Samsung S24" value="Samsung S24" />
        <el-option label="小米手机" value="小米手机" />
        <el-option label="OPPO手机" value="OPPO手机" />
        <el-option label="华为手机" value="华为手机" />
      </el-select>
    </el-form-item>

    <el-form-item label="活动状态" prop="status">
      <el-radio-group v-model="formData.status">
        <el-radio value="未开始">未开始</el-radio>
        <el-radio value="进行中">进行中</el-radio>
        <el-radio value="已暂停">已暂停</el-radio>
        <el-radio value="已结束">已结束</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { usePromotionStore } from '@/stores/promotion'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// 表单引用
const formRef = ref()

// 时间范围
const timeRange = ref([])

// 表单数据
const formData = reactive({
  id: null,
  name: '',
  type: '',
  description: '',
  startTime: '',
  endTime: '',
  status: '未开始',
  discountType: 'amount',
  discountValue: 0,
  minAmount: 0,
  maxDiscount: 0,
  usageLimit: 1,
  applicableProducts: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 2, max: 50, message: '活动名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '请选择活动时间', trigger: 'change' }
  ],
  discountType: [
    { required: true, message: '请选择优惠类型', trigger: 'change' }
  ],
  discountValue: [
    { required: true, message: '请输入优惠值', trigger: 'blur' },
    { type: 'number', min: 0, message: '优惠值不能小于0', trigger: 'blur' }
  ],
  minAmount: [
    { type: 'number', min: 0, message: '最低消费不能小于0', trigger: 'blur' }
  ],
  maxDiscount: [
    { type: 'number', min: 0, message: '最大优惠不能小于0', trigger: 'blur' }
  ],
  usageLimit: [
    { required: true, message: '请输入使用限制', trigger: 'blur' },
    { type: 'number', min: 1, message: '使用限制至少为1次', trigger: 'blur' }
  ],
  applicableProducts: [
    { required: true, type: 'array', min: 1, message: '请至少选择一个适用商品', trigger: 'change' }
  ]
}

// Pinia store
const promotionStore = usePromotionStore()

// 初始化表单数据
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(formData, {
      id: newValue.id || null,
      name: newValue.name || '',
      type: newValue.type || '',
      description: newValue.description || '',
      startTime: newValue.startTime || '',
      endTime: newValue.endTime || '',
      status: newValue.status || '未开始',
      discountType: newValue.discountType || 'amount',
      discountValue: newValue.discountValue || 0,
      minAmount: newValue.minAmount || 0,
      maxDiscount: newValue.maxDiscount || 0,
      usageLimit: newValue.usageLimit || 1,
      applicableProducts: newValue.applicableProducts || []
    })
    timeRange.value = newValue.startTime && newValue.endTime 
      ? [newValue.startTime, newValue.endTime] 
      : []
  },
  { immediate: true, deep: true }
)

// 处理时间变化
const handleTimeChange = (val) => {
  if (val && val.length === 2) {
    formData.startTime = val[0]
    formData.endTime = val[1]
  } else {
    formData.startTime = ''
    formData.endTime = ''
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const promotionData = { ...formData }
    
    if (props.isEdit) {
      await promotionStore.updatePromotion(formData.id, promotionData)
      ElMessage.success('促销活动更新成功')
    } else {
      await promotionStore.createPromotion(promotionData)
      ElMessage.success('促销活动创建成功')
    }
    
    emit('submit', promotionData)
  } catch (error) {
    ElMessage.error(props.isEdit ? '更新促销活动失败' : '创建促销活动失败')
  }
}

// 重置表单
const handleReset = () => {
  formRef.value.resetFields()
  timeRange.value = []
  emit('cancel')
}
</script>

<style scoped>
.promotion-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.unit {
  margin-left: 8px;
  color: #606266;
}
</style>
