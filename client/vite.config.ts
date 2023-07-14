import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        // additionalData: '@import "./src/assets/styles/_variables.scss";',
        additionalData: '@import "./src/assets/styles/_theme.scss";',
        // additionalData: '@import "./src/assets/styles/index.scss";',
      },
    },
  },
})
