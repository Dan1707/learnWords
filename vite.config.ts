import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueDevTools(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: 'https://ftapi.pythonanywhere.com',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ''),
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/shared/components'),
			'@ui': path.resolve(__dirname, './src/shared/components/ui'),
			'@types': path.resolve(__dirname, './src/shared/types'),
			'@composables': path.resolve(__dirname, './src/shared/composables'),
			'@api': path.resolve(__dirname, './src/shared/api'),
		},
	},
})
