import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Порт настраивается через переменную PORT, по умолчанию 3000 (как в задании)
const port = Number(process.env.PORT) || 3000;

export default defineConfig({
  plugins: [react()],
  server: { port, strictPort: true },
  preview: { port, strictPort: true },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5 пока использует @import — убираем лишний шум предупреждений Sass
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        quietDeps: true,
      },
    },
  },
});
