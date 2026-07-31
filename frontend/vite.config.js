


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://campus-hire.duckdns.org',
        changeOrigin: true,
        cookieDomainRewrite: "localhost"
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: ['node_modules/', 'src/setupTests.js']
    }
  }
})




