import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/wu14-quacker-natascha-quacker/",
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true
  },
})