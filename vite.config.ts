import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8081
  },
  envDir: './src/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
  },
  build: {
    outDir: 'attribute-reporter',
    cssCodeSplit: false,
    sourcemap: false,
    minify: false,
    rollupOptions: {
      external: ['icon-32.png', './icon-32.png'], //(id) => id.startsWith('/gallery/'),
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
})
