import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

function manifestVersionPlugin() {
  return {
    name: 'manifest-version',
    writeBundle(options: { dir?: string }) {
      const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
      const outDir = options.dir ?? 'dist';
      const manifestPath = resolve(outDir, 'manifest.json');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      manifest.version = pkg.version;
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),

    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        //{ src: 'public/icons', dest: '.' },
      ],
    }),
    manifestVersionPlugin(),
  ],
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
