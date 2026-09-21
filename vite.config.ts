import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Base path for GitHub Pages project site: https://<user>.github.io/Farepulse/
  base: '/Farepulse/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
