import { defineConfig, loadEnv, ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
        "@features": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src/features"),
        "@api": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src/api"),
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
        strict: true
      },
      hmr: {
        overlay: true
      }
    },
    optimizeDeps: {
      include: ['axios'],
      exclude: [],
      esbuildOptions: {
        target: 'es2020'
      }
    },
    build: {
      sourcemap: true,
      target: 'es2020',
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'index.html')
        }
      }
    },
    esbuild: {
      target: 'es2020'
    },
    publicDir: 'public',
    configureServer: (server: ViteDevServer) => {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/mockServiceWorker.js') {
          res.setHeader('Content-Type', 'application/javascript');
        }
        next();
      });
    }
  }
})
