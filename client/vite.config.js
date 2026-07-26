import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      // Все запросы, начинающиеся с /balance, будут проксироваться на сервер
      '/balance': 'http://localhost:5050',
    },
  },
})
