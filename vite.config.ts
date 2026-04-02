import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gigachat-api': {
        target: 'https://gigachat.devices.sberbank.ru/api/v1',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gigachat-api/, ''),
      },
      '/gigachat-auth': {
        target: 'https://ngw.devices.sberbank.ru:9443/api/v2',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gigachat-auth/, ''),
      },
    },
  },
})
