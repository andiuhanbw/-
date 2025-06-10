<template>
  <el-container class="app-container">
    <el-aside width="200px">
      <el-menu
        :default-active="$route.path"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/category">
          <span>类别管理</span>
        </el-menu-item>
        <el-menu-item index="/inventory">
          <span>库存管理</span>
        </el-menu-item>
        <el-menu-item index="/order"> <!-- 改为 /order -->
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/product"> <!-- 改为 /product -->
          <span>产品管理</span>
        </el-menu-item>
        <el-menu-item index="/statistics">
          <span>统计数据</span>
        </el-menu-item>
        <el-menu-item index="/ticket"> <!-- 改为 /ticket -->
          <span>工单管理</span>
        </el-menu-item>
        <el-menu-item index="/user"> <!-- 改为 /user -->
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ElContainer, ElAside, ElMain, ElMenu, ElMenuItem } from 'element-plus'
</script>

<style scoped>
.app-container {
  height: 100vh;
}
.el-menu {
  height: 100%;
}
</style>
