import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:5174'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': backendUrl,
    },
  },
})
