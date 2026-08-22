import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(browserslist('>= 0.25%'))
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
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
