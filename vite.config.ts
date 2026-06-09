import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Исправляем возможную ошибку с __dirname в ES-модулях
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
    // Важно для работы в локальной сети (например, потестить с телефона)
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Настройка CSS (полезно для будущего)
  css: {
    devSourcemap: true, // Показывает в инспекторе браузера точное место в твоем .module.css
  },
  build: {
    outDir: 'dist', // Папка для готового проекта (стандарт)
    sourcemap: false, // Отключаем карты кода в билде для экономии веса
  },
});
