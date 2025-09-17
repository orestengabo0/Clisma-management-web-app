// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths' // <--- Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()], // <--- Add it to the plugins array
})