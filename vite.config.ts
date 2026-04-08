import react from '@vitejs/plugin-react'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const certPath = resolve(__dirname, 'cert/pandatech.it+3.pem')
const keyPath = resolve(__dirname, 'cert/pandatech.it+3-key.pem')
const hasCerts = existsSync(certPath) && existsSync(keyPath)

/**
 * Auto-discovery of path aliases.
 * Every top-level subfolder of `src/` becomes importable as `from 'foo'`.
 * Add a matching entry in `tsconfig.app.json` paths so TS resolves it too.
 */
function getAliases() {
  const srcPath = resolve(__dirname, 'src')
  const entries = readdirSync(srcPath, { withFileTypes: true })

  return entries
    .filter(dirent => dirent.isDirectory())
    .reduce<Record<string, string>>((acc, dirent) => {
      acc[dirent.name] = resolve(srcPath, dirent.name)
      return acc
    }, {})
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint .',
      },
      overlay: {
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: getAliases(),
  },
  server: hasCerts
    ? {
        https: {
          key: readFileSync(keyPath),
          cert: readFileSync(certPath),
        },
        host: 'react.pandatech.it',
        port: 5173,
        strictPort: true,
      }
    : {
        port: 5173,
        strictPort: true,
      },
  build: {
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: true,
    // antd alone is ~600kB minified / ~200kB gzipped — bump above that.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Explicit vendor splitting for long-term browser caching:
        // when your code changes, vendor chunks stay cached.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/antd/') || id.includes('/@ant-design/') || id.includes('/rc-')) {
            return 'antd-vendor'
          }
          if (id.includes('/@reduxjs/') || id.includes('/react-redux/')) {
            return 'redux-vendor'
          }
          if (
            id.includes('/react-router') ||
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }
          return 'vendor'
        },
      },
    },
  },
})
