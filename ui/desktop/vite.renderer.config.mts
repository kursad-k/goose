import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    'process.env.GOOSE_TUNNEL': JSON.stringify(process.env.GOOSE_TUNNEL !== 'no' && process.env.GOOSE_TUNNEL !== 'none'),
  },

  plugins: [tailwindcss()],

  // Force a single React instance. @aaif/goose-sdk is excluded from dep
  // optimization (below) and resolves React through its own path, which made
  // Vite pre-bundle React twice — react-router-dom then held a dead second
  // copy and threw "Cannot read properties of null (reading 'useRef')".
  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  // Vite caches a copy of @aaif/goose-sdk and doesn't notice when we rebuild it
  // locally, so it serves stale code until you clear node_modules/.vite by hand.
  // Excluding it makes Vite always read the latest ui/sdk/dist build.
  // Dev-server only — release builds ignore optimizeDeps.
  optimizeDeps: {
    exclude: ['@aaif/goose-sdk'],
  },

  build: {
    target: 'esnext'
  },
});
