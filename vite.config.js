const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  root: path.resolve(__dirname, 'src/frontend'),
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0'
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/frontend'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/frontend/index.html')
    }
  }
});
