// src/stores/order.js
import { defineStore } from 'pinia';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/order';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [], // 订单列表
    loading: false, // 加载状态
    total: 0, // 总记录数
    page: 1, // 当前页
    pageSize: 10, // 每页大小
  }),
  actions: {
    // 获取订单列表
    async fetchOrders(params = {}) {
      this.loading = true;
      try {
        const { data } = await getOrders({
          page: this.page,
          pageSize: this.pageSize,
          ...params,
        });
        this.orders = data.list;
        this.total = data.total;
      } catch (error) {
        console.error('获取订单列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    // 新增订单
    async addOrder(order) {
      try {
        const { data } = await createOrder(order);
        this.orders.unshift(data);
        this.total += 1;
      } catch (error) {
        console.error('新增订单失败:', error);
      }
    },
    // 更新订单
    async updateOrder(id, order) {
      try {
        await updateOrder(id, order);
        const index = this.orders.findIndex((o) => o.id === id);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...order };
        }
      } catch (error) {
        console.error('更新订单失败:', error);
      }
    },
    // 删除订单
    async removeOrder(id) {
      try {
        await deleteOrder(id);
        this.orders = this.orders.filter((o) => o.id !== id);
        this.total -= 1;
      } catch (error) {
        console.error('删除订单失败:', error);
      }
    },
  },
});
