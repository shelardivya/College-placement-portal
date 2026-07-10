import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tinsmith-clamp-oversight.ngrok-free.dev',
        changeOrigin: true,
        rewrite: (path) => {
          // Keep '/api' for admin job endpoints, strip it for auth endpoints
          if (path.includes('/admin/job/')) {
            return path;
          }
          return path.replace(/^\/api/, '');
        },
        headers: {
          'ngrok-skip-browser-warning': 'any-value'
        }
      }
    }
  }
})

