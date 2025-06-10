import { defineStore } from 'pinia';
import axios from 'axios';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    inventoryList: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Fetch all inventory items
    async fetchInventory() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/inventory');
        this.inventoryList = response.data;
      } catch (error) {
        this.error = error.message || 'Failed to fetch inventory';
      } finally {
        this.loading = false;
      }
    },

    // Add a new product
    async addProduct(product) {
      try {
        const response = await axios.post('http://localhost:3000/inventory', product);
        this.inventoryList.push(response.data);
      } catch (error) {
        this.error = error.message || 'Failed to add product';
        throw error;
      }
    },

    // Update an existing product
    async updateProduct(productId, updatedProduct) {
      try {
        const response = await axios.put(`http://localhost:3000/inventory/${productId}`, updatedProduct);
        const index = this.inventoryList.findIndex(item => item.id === productId);
        if (index !== -1) {
          this.inventoryList[index] = response.data;
        }
      } catch (error) {
        this.error = error.message || 'Failed to update product';
        throw error;
      }
    },

    // Delete a product
    async deleteProduct(productId) {
      try {
        await axios.delete(`http://localhost:3000/inventory/${productId}`);
        this.inventoryList = this.inventoryList.filter(item => item.id !== productId);
      } catch (error) {
        this.error = error.message || 'Failed to delete product';
        throw error;
      }
    },
  },
});
