import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// 這是你的「最終正確」設定
export default defineConfig({
  // 1. 我們保留你正確的部署路徑
  base: '/lotus-bf-frontend-YINCHI320/',

  build: {
    outDir: 'docs'
  },

  // 2. 我們保留你專案原有的 react 插件
  plugins: [react()],
  
  // 3. 我們保留你專案原有的 'resolve' 設定
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // 4. 我們保留你專案原有的 'server' 設定
  server: {
    allowedHosts: ['mil.psy.ntu.edu.tw']
  }
})