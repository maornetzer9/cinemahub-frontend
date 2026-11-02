import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // Keep Three on the lazy Register import. A manual Three chunk absorbs
          // shared modules such as the Vite preload helper and makes Login load it.
          if (id.includes('@mui')) return 'mui'
          if (id.includes('framer-motion')) return 'motion'
        },
      },
    },
  },
})
