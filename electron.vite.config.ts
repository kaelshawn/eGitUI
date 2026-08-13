import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          home: resolve(__dirname, 'src/renderer/home.html'),
          empty: resolve(__dirname, 'src/renderer/empty.html'),
          repository: resolve(__dirname, 'src/renderer/repository.html')
        }
      }
    }
  }
})
