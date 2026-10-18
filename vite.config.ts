import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        anatomy: fileURLToPath(new URL('./anatomy.html', import.meta.url)),
        standard: fileURLToPath(new URL('./standard.html', import.meta.url)),
        'command-center': fileURLToPath(new URL('./command-center.html', import.meta.url)),
        studio: fileURLToPath(new URL('./studio.html', import.meta.url)),
      },
    },
  },
});
