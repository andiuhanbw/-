import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
      prodEnabled: false,
      supportTs: false,
      watchFiles: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3003,
    open: true,
    proxy: {
      '/mock/orders': {
        target: 'http://localhost:3004', // 假设后端 Express 服务器运行在 3004 端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mock\/orders/, '')
      }
    }
  }
})
