// src/stores/product.js
import { defineStore } from 'pinia';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/product';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [], // 商品列表
    loading: false, // 加载状态
    total: 0, // 总记录数
    page: 1, // 当前页
    pageSize: 10, // 每页大小
  }),
  actions: {
    // 获取商品列表
    async fetchProducts(params = {}) {
      this.loading = true;
      try {
        const { data } = await getProducts({
          page: this.page,
          pageSize: this.pageSize,
          ...params,
        });
        this.products = data.list;
        this.total = data.total;
      } catch (error) {
        console.error('获取商品列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    // 新增商品
    async addProduct(product) {
      try {
        const { data } = await createProduct(product);
        this.products.unshift(data);
        this.total += 1;
      } catch (error) {
        console.error('新增商品失败:', error);
      }
    },
    // 更新商品
    async updateProduct(id, product) {
      try {
        await updateProduct(id, product);
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...product };
        }
      } catch (error) {
        console.error('更新商品失败:', error);
      }
    },
    // 删除商品
    async removeProduct(id) {
      try {
        await deleteProduct(id);
        this.products = this.products.filter((p) => p.id !== id);
        this.total -= 1;
      } catch (error) {
        console.error('删除商品失败:', error);
      }
    },
  },
});
