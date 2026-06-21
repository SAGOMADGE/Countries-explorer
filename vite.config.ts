import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // --- НОВОЕ ---
  test: {
    environment: 'jsdom', // эмулируем браузер — без этого нет document, window
    globals: true, // можно писать describe/it/expect без импорта — как в Jest
    setupFiles: './src/setupTests.ts', // файл который запускается ПЕРЕД каждым тест-файлом
    css: true, // обрабатывать CSS Modules — без этого импорт .module.css падает
  },
});
