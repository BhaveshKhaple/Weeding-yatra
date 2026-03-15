import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Use tsconfig paths for module resolution (Context7 recommended)
    tsconfigPaths: true,
  },
  server: {
    port: 5173,
    open: false,
  },
})
