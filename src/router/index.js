import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from '../views/CategoryView.vue'
import InventoryView from '../views/InventoryView.vue'
import OrderView from '../views/OrderView.vue'
import ProductView from '../views/ProductView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import TicketView from '../views/TicketView.vue'
import UserView from '../views/UserView.vue'

const routes = [
  { path: '/', redirect: '/inventory' }, // 默认重定向到库存页面
  { path: '/category', component: CategoryView }, // 类别管理
  { path: '/inventory', component: InventoryView }, // 库存管理
  { path: '/order', component: OrderView }, // 订单管理
  { path: '/product', component: ProductView }, // 产品管理
  { path: '/statistics', component: StatisticsView }, // 统计数据
  { path: '/ticket', component: TicketView }, // 工单管理
  { path: '/user', component: UserView }, // 用户管理
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: () => import('../views/NotFound.vue') // 404 页面
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
