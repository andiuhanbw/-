<!-- views/category/CategoryManage.vue -->
<template>
  <div class="category-manage">
    <h2>分类管理</h2>
    <el-button type="primary" @click="showAddDialog">添加分类</el-button>
    
    <!-- 分类列表 -->
    <el-table :data="categories" style="width: 100%" border>
      <el-table-column prop="id" label="分类ID" width="100" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteCategory(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCategory">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { ElMessage } from 'element-plus'

// 初始化 Pinia store
const categoryStore = useCategoryStore()

// 分类列表
const categories = computed(() => categoryStore.categories)

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const categoryForm = ref({ id: null, name: '' })

// 获取分类列表
const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories()
  } catch (error) {
    ElMessage.error(error.message || '获取分类列表失败')
  }
}

// 显示添加分类对话框
const showAddDialog = () => {
  dialogTitle.value = '添加分类'
  categoryForm.value = { id: null, name: '' }
  dialogVisible.value = true
}

// 显示编辑分类对话框
const showEditDialog = (category) => {
  dialogTitle.value = '编辑分类'
  categoryForm.value = { ...category }
  dialogVisible.value = true
}

// 提交分类（添加或编辑）
const submitCategory = async () => {
  try {
    if (categoryForm.value.id) {
      // 编辑分类
      await categoryStore.updateCategory(categoryForm.value.id, { name: categoryForm.value.name })
      ElMessage.success('分类编辑成功')
    } else {
      // 添加分类
      await categoryStore.addCategory({ name: categoryForm.value.name })
      ElMessage.success('分类添加成功')
    }
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(error.message || '操作失败')
  }
}

// 删除分类
const deleteCategory = async (id) => {
  try {
    await categoryStore.deleteCategory(id)
    ElMessage.success('分类删除成功')
  } catch (error) {
    ElMessage.error(error.message || '删除失败')
  }
}

// 页面加载时获取分类列表
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-manage {
  padding: 20px;
}
</style>
