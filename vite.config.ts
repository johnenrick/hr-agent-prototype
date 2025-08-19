import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // This makes all assets use relative paths
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting for better compatibility
      }
    }
  }
})
