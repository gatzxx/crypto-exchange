import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        open: true,
        port: 3000,
    },
})
